// ==UserScript==
// @name         Fix ADS checkin comments in discussion and history of workitems
// @version      0.6
// @author       Tobias Sachs
//  ... in @match replace "ads" with the url of you Azure DevOps Server
// @match        https://ads/*
// @updateURL    https://github.com/tsheba/tampermonkeyscripts/raw/master/AzureDevOpsCommentEnhancer.user.js
// @downloadURL  https://github.com/tsheba/tampermonkeyscripts/raw/master/AzureDevOpsCommentEnhancer.user.js
// @grant        none
// @description
// ==/UserScript==

// 0.6: Add link to Changeset in diff view

(function() {
    'use strict';
    let timerId = undefined;

    let fixWorkitems = () =>
    {
        let found = document.getElementsByClassName("comment-content");
        fixCommentContents(found);

        found = document.getElementsByClassName("history-item-comment");
        fixCommentContents(found);

        console.debug("observe...");
    }
    let fixCommentContents = (items) =>
    {
        if (items === null || items === undefined || items.length === 0)
        {
            return;
        }
        console.info("fixing '" + items.length +"' comments.");
        for (var i = 0; i < items.length; i++){
            let el = items[i];
            let html = el.innerHTML;
            if (html.startsWith("Associated"))
            {
                html = html.replace(/(Associated with changeset )(\d*):/, "<b>$1<a href='/HeBa/Entwicklung/_versionControl/changeset/$2'>$2</a></b>:<br />");
                el.innerHTML = html.replace(/\n/gi, "<br />");
            }
        }
    };

    let fixVersionControl = () =>
    {
        let elToFix;
        let found = document.getElementsByClassName("changeset-version")[0];
        if (found) {
            // if opened from email notification it is the first span in div "changeset-version"
            elToFix = found.querySelector("span");
        }
        else
        {
            // if opened from histrory in ads it is the span in div "changeset-id"
            // elToFix = document.getElementsByClassName("changeset-id")[0];
        }
        if (!elToFix)
        {
            return;
        }

        elToFix.innerHTML = elToFix.innerHTML.replace(/(Changeset )(\d+)/, "$1<a href='/HeBa/Entwicklung/_versionControl/changeset/$2'>$2</a>");

    }

    let fixit = () => {
        if (timerId){
            console.debug("fixit timerreset...");
            clearTimeout(timerId);
        }

        observer.disconnect();

        timerId = setTimeout(function(){
            timerId = undefined;

            let url = window.location.href;

            if (url.includes("/_versionControl"))
            {
                fixVersionControl();
            }
            else if (url.includes("/_workitems")){
                fixWorkitems();
            }
            else
            {
                console.info("nothing to do here");
                return;
            }

            // keep watching for changes.
            observer.observe(document, { subtree: true, childList: true, characterData: true });
        }, 300);
    };

    const observer = new MutationObserver(function() {
        console.debug('observertriggered...');
        fixit();
    });

    fixit();

})();
