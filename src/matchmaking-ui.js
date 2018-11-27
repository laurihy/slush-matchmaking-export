function asList(htmlCollection) {
    return [].slice.call(htmlCollection)
}

function getCardTitles(meetingNode) {
    return asList(meetingNode.getElementsByTagName('mat-card-title'));
}

function getProfileContainers(meetingNode) {
    return asList(meetingNode.getElementsByClassName('profile-container'));
}

function getMeetingItems(parentNode) {
    return asList(parentNode.getElementsByTagName('app-meeting-item'))
}

function getLocationSpan(meetingNode) {
    // this is a little tricky,
    // assume there's something like
    // <h4>Where</h4><span>This is location</span>
    const titles = meetingNode.getElementsByTagName('h4');
    if (!titles.length) {
        return;
    }

    const locationTitles = asList(titles).filter((t) => { return t.innerText.indexOf('Where') > 0 });
    if (!locationTitles.length) {
        return;
    }

    return locationTitles[0].nextSibling
}

module.exports = {
    getCardTitles: getCardTitles,
    getProfileContainers: getProfileContainers,
    getMeetingItems: getMeetingItems,
    getLocationSpan: getLocationSpan
}
