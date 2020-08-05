// ==UserScript==
// @name         Fix ADS checkin comments in discussion and history of workitems
// @version      0.1
// @author       Tobias Sachs
//  ... add match eg https://myazerdevops/*
// @match        https://
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let timerId = undefined;
    let fixComments = (items) =>
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
    let fixit = () => {
        if (timerId){
            console.debug("fixit timerreset...");
            clearTimeout(timerId);
        }

        observer.disconnect();
        timerId = setTimeout(function(){
            timerId = undefined;
            let found = document.getElementsByClassName("comment-content");
            fixComments(found);

            found = document.getElementsByClassName("history-item-comment");
            fixComments(found);

            console.debug("observe...");
            observer.observe(document, { subtree: true, childList: true, characterData: true });
        }, 300);
    };

    const observer = new MutationObserver(function() {
        console.debug('observertriggered...');
        fixit();
    });

    fixit();

})();
