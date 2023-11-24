document.getElementById("scrape").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: scrapePage,
    },
    (results) => {
      if (results[0].result == null) return;

      // // let infodiv = document.getElementById("output");
      // let invitediv = document.getElementById("invitation");
      // let activediv = document.getElementById("active");
      // let submitdiv = document.getElementById("submitted");

      // results[0].result.invitationobj.forEach((result) => {
      //   let date = document.createElement("span");
      //   let title = document.createElement("span");
      //   let user = document.createElement("span");
      //   date.textContent = result.date;
      //   title.textContent = result.title;
      //   user.textContent = result.user;
      //   invitediv.appendChild(date);
      //   invitediv.appendChild(title);
      //   invitediv.appendChild(user);
      // });

      // results[0].result.activeobj.forEach((result) => {
      //   let date = document.createElement("span");
      //   let title = document.createElement("span");
      //   let user = document.createElement("span");
      //   date.textContent = result.date;
      //   title.textContent = result.title;
      //   user.textContent = result.user;
      //   activediv.appendChild(date);
      //   activediv.appendChild(title);
      //   activediv.appendChild(user);
      // });

      // results[0].result.submittedobj.forEach((result) => {
      //   let date = document.createElement("span");
      //   let title = document.createElement("span");
      //   let user = document.createElement("span");
      //   date.textContent = result.date;
      //   title.textContent = result.title;
      //   user.textContent = result.user;
      //   submitdiv.appendChild(date);
      //   submitdiv.appendChild(title);
      //   submitdiv.appendChild(user);
      // });

      let csvContent = "data:text/csv;charset=utf-8,";
      let section = ["Invitations to interview","Active proposals","Submitted proposals"]
      let header = ['Date', 'Title', 'User',"Proposal Type"].join(',');
      csvContent += header + '\r\n';
      results[0].result.invitationobj.forEach((result) => {
        let row = [result.date.trim().replace(',', ''), result.title.trim(), result.user.trim(),section[0]].join(',');
        csvContent += row + "\r\n";
      });

      results[0].result.activeobj.forEach((result) => {
        let row = [result.date.trim().replace(',', ''), result.title.trim(), result.user.trim(),section[1]].join(',');
        csvContent += row + "\r\n";
      });

      results[0].result.submittedobj.forEach((result) => {
        let row = [result.date.trim().replace(',', ''), result.title.trim(), result.user.trim(),section[2]].join(',');
        csvContent += row + "\r\n";
      });

      let encodedUri = encodeURI(csvContent);
      let link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "scrape_data.csv");
      document.body.appendChild(link);
      link.click();
      
    }
  );
});

function scrapePage() {
  let invitation = Array.from(
    document.querySelectorAll(
      ".lists-container .invitations-card-view .fe-hide-last-border .details-row"
    )
  );
  let active = Array.from(
    document.querySelectorAll(
      ".lists-container .active-proposals-card-view .fe-hide-last-border .details-row"
    )
  );
  let submitted = Array.from(
    document.querySelectorAll(
      ".lists-container .submitted-proposals-card-view .fe-hide-last-border .details-row"
    )
  );

  //Invitation Data
  let invitationobj = invitation.map((tr) => ({
    title: tr.querySelector(".job-info a").textContent,
    user: tr.querySelector(".default-slot .contractor-name").textContent,
    date: tr.querySelector(".time-slot .nowrap").textContent,
  }));

  //Active Proposal Data
  let activeobj = active.map((tr) => ({
    title: tr.querySelector(".job-info a").textContent,
    user: tr.querySelector(".default-slot .contractor-name").textContent,
    date: tr.querySelector(".time-slot .nowrap").textContent,
  }));

  //submitted Proposal Data
  let submittedobj = submitted.map((tr) => ({
    title: tr.querySelector(".job-info a").textContent,
    user: tr.querySelector(".default-slot .contractor-name").textContent,
    date: tr.querySelector(".time-slot .nowrap").textContent,
  }));

  return { invitationobj, activeobj, submittedobj };
}
