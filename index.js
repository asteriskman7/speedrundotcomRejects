"use strict";

/*
  TODO:
    disable prev/next page buttons as appropriate
    show some status to indicate fetch is running
    include run date    

*/

class App {
  constructor() {
    document.getElementById('bSearch').addEventListener('click', () => this.clickSearch() );
    document.getElementById('bLoad').addEventListener('click', () => this.clickLoad() );
    document.getElementById('bGamePagePrev').addEventListener('click', () => this.changeGamePage(-1) );
    document.getElementById('bGamePageNext').addEventListener('click', () => this.changeGamePage(1) );
    document.getElementById('bRunPagePrev').addEventListener('click', () => this.changeRunPage(-1) );
    document.getElementById('bRunPageNext').addEventListener('click', () => this.changeRunPage(1) );
  }

  clickSearch() {
    const gameName = document.getElementById('textName').value;
    const page = parseInt(document.getElementById('gamePage').value);
    let offset;
    if (!isNaN(page)) {
      offset = `&offset=${20 * (page - 1)}`;
    } else {
      offset = '';
    }
    const URL = `https://www.speedrun.com/api/v1/games?name=${encodeURIComponent(gameName)}${offset}`;
    fetch(URL)
    .then( response => response.json() )
    .then( data => this.buildGamesTable(data, page) );
  }

  changeGamePage(delta) {
    let page = parseInt(document.getElementById('gamePage').value);
    if (isNaN(page)) {
      page = 1;
    }
    page += delta;
    document.getElementById('gamePage').value = page;
    this.clickSearch();
  }

  buildGamesTable(data, page) {
    console.log(data);
    
    const container = document.getElementById('nameResults');
    container.innerHTML = '';

    //create table
    const table = document.createElement('table');

    //create header
    const headerRow = document.createElement('tr');
    const headerColumns = '#,Load,Name,ID,Link'.split`,`;
    headerColumns.forEach( c => {
      const column = document.createElement('th');
      column.innerText = c;
      headerRow.appendChild(column);
    });
    //add header to table
    table.appendChild(headerRow);

    //add each row
    data.data.forEach( (game, i) => {
      const row = document.createElement('tr');
      const numCell = document.createElement('td');
      numCell.innerText = (page - 1) * 20 + i + 1;
      row.appendChild(numCell);

      const buttonCell = document.createElement('td');
      const button = document.createElement('button');
      button.innerText = 'Load';
      button.addEventListener('click', () => this.clickLoad(game.id) );
      buttonCell.appendChild(button);
      row.appendChild(buttonCell);

      const nameCell = document.createElement('td');
      nameCell.innerText = game.names.international;
      row.appendChild(nameCell);

      const idCell = document.createElement('td');
      idCell.innerText = game.id;
      row.appendChild(idCell);

      const linkCell = document.createElement('td');
      const link = document.createElement('a');
      link.href = game.weblink;
      link.innerText = game.weblink;
      linkCell.appendChild(link);
      row.appendChild(linkCell);

    //add row to table
      table.appendChild(row);
    });

    //add table to container
    container.appendChild(table);
  }

  clickLoad(gameID) {
    if (gameID === undefined) {
      gameID = document.getElementById('textID').value;
    } else {
      document.getElementById('textID').value = gameID;
    }
    const page = parseInt(document.getElementById('runPage').value);
    let offset;
    if (!isNaN(page)) {
      offset = `&offset=${20 * (page - 1)}`;
    } else {
      offset = '';
    }

    const URL = `https://www.speedrun.com/api/v1/runs?game=${gameID}&status=rejected${offset}`;
    fetch(URL)
    .then( response => response.json() )
    .then( data => this.buildRunsTable(data, page) );
  }

  changeRunPage(delta) {
    let page = parseInt(document.getElementById('runPage').value);
    if (isNaN(page)) {
      page = 1;
    }
    page += delta;
    document.getElementById('runPage').value = page;
    this.clickLoad();
  }


  buildRunsTable(data, page) {
    console.log(data);
    const container = document.getElementById('runResults');
    container.innerHTML = '';

    //create table
    const table = document.createElement('table');
    //create header
    const headerRow = document.createElement('tr');
    const headerColumns = '#,Video,Link,Reason'.split`,`;
    headerColumns.forEach( c => {
      const column = document.createElement('th');
      column.innerText = c;
      headerRow.appendChild(column);
    });

    //add header to table
    table.appendChild(headerRow);

    //create each row
    data.data.forEach( (run, i) => {
      const row = document.createElement('tr');

      const numCell = document.createElement('td');
      numCell.innerText = (page - 1) * 20 + i + 1;
      row.appendChild(numCell);

      const videoCell = document.createElement('td');
      const videoLink = document.createElement('a');
      if (run.videos.links) {
        videoLink.href = run.videos.links[0].uri;
        videoLink.innerText = 'video';
      }
      if (run.videos.text) {
        //TODO: saw a case where the text didn't start with http. is that normal?
        videoLink.href = run.videos.text;
        videoLink.innerText = 'video';
      }
      videoCell.appendChild(videoLink);
      row.appendChild(videoCell);

      const linkCell = document.createElement('td');
      const linkLink = document.createElement('a');
      linkLink.href = run.weblink;
      linkLink.innerText = run.weblink;
      linkCell.appendChild(linkLink);
      row.appendChild(linkCell);

      const reasonCell = document.createElement('td');
      reasonCell.innerText = run.status.reason;
      row.appendChild(reasonCell);

    //add row to table
      table.appendChild(row);
    });

    //add table to container
    container.appendChild(table);
  }

}

const app = new App();
