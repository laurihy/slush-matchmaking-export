const luxon = require('luxon');
const ics = require('./ics');
const matchmakingUI = require('./matchmaking-ui.js');

(function() {

    function dateStrToIso(datestr) {
        // Parse string like "Dec 4th, 2:00 pm - 2:30 pm"
        // from Slush Matchmaking UI into start and end time
        const re = /(Dec)\s(\d*)\D*(\d*:\d*\s(am|pm)) - (\d*:\d*\s(am|pm))/g
        const parts = re.exec(datestr);
        const date = parts[1] + ' '+  2018 + ' ' + parts[2];
        const start = date + ' ' + parts[3] + ' +0200';
        const end = date + ' ' + parts[5] + ' +0200';
        const format = 'MMM yyyy d h:mm a ZZZ'

        return [
            luxon.DateTime.fromFormat(start, format, {setZone: true}),
            luxon.DateTime.fromFormat(end, format, {setZone: true})
        ]
    }

    function findLocation(elem) {

        locationSpan = matchmakingUI.getLocationSpan(elem);
        if (locationSpan) {
            return locationSpan.innerText;
        } else {
            return 'Unknown location';
        }
    }

    function downloadEvents(events) {

        const cal = ics();
        events.forEach((e) => {
            cal.addEvent(e.subject, e.description, e.location, e.start, e.end);
        })
        cal.download();

        alert('This will now download a calendar.ics file which contains all your meetings. As the last step, you should import it to your calendar.');
    }

    function personFromProfileElem(p) {
        const titles = p.getElementsByClassName('title');
        const descriptions = p.getElementsByClassName('description')
        const name = (titles.length > 0) ? titles[0].innerText : 'Unknown name';
        const description = (descriptions.length > 0) ? descriptions[0].innerText : 'Unknown name';
        return {
            'name': name,
            'description': description
        }
    }

    function getEventInfoForElem(elem) {

        const dates = dateStrToIso(matchmakingUI.getCardTitles(elem)[0].innerText);
        const profiles = matchmakingUI.getProfileContainers(elem);
        const persons = profiles.map(personFromProfileElem);

        return {
            start: dates[0],
            end: dates[1],
            location: 'Messukeskus: ' + findLocation(elem),
            subject: 'Slush: ' + persons.map((p) => { return p.name }).join(', '),
            description: persons.map((p) => { return p.name +': ' + p.description}).join('\n\n')
        }
    }

    function main() {

        if (document.location.toString().indexOf('//platform.slush.org/slush18/matchmaking/my-meetings') < 0) {
            alert('Start by going to https://platform.slush.org/slush18/matchmaking/my-meetings');
            return;
        }

        const meetingElems = matchmakingUI.getMeetingItems(document);
        if (meetingElems.length === 0) {
            alert('Looks like there are no meetings to export');
            return;
        }

        downloadEvents(meetingElems.map(getEventInfoForElem))
    }

    main();

})();
