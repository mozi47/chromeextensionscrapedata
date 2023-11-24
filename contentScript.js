chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'scrapeGoogleSearch') {
      scrapeGoogleSearch();
    }
  });
  
  function scrapeGoogleSearch() {
    var results = [];
    var links = document.querySelectorAll('.tF2Cxc');
  
    for (var i = 0; i < links.length; i++) {
        let link = links[i].querySelector('a').href;
        let title = links[i].querySelector('h3').textContent;
  
      results.push({ link: link, title: title});
    }
    chrome.runtime.sendMessage({ action: 'displayResults', results: results });
  }
