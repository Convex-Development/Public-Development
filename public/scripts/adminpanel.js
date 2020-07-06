//admin panel//

var infoOpened = '',
    reason = '',
    length = '',
    accountDeletionRange;

var STAGED_ACCOUNTS = []
var cmdlineJS = ``;

function peopleOptionClicked() {
  $('#panel-nav-page').html('Page : People')
  $('#panel-right').empty()

  socket.emit('fetch-people', {
    filter : "all"
  })
}

function adminOptionClicked() {
  $('#panel-nav-page').html('Page : Admins')
  $('#panel-right').empty()

  socket.emit('fetch-people', {
    filter : "administrators"
  })
}

socket.on('people', function(info) {
  $('#panel-right').append(`
    <div id="users">
      ${info.people}
    </div>
  `)
})

function userHover(id) {
  if ($('#' + id).find('img').length) {
    
  } else {
    $('#' + id).append(`
      <img src="https://media.discordapp.net/attachments/651993623021355018/683385228387024912/unknown.png?width=422&height=422"/>
    `)
  }
}

function userUnhover(id) {
  if(infoOpened != id) {
    $('#' + id + ' img').remove()
  }
  
}

function seeInfo(id, visible) {
  if(id != infoOpened) {
    if(infoOpened) {
      $('#' + infoOpened + 'info').remove();
      $('#' + infoOpened).css("background", "transparent")
      $('#' + infoOpened + ' img').remove()
    }


    socket.emit('fetchUserInfo', {
      userid : id 
    })
    
    $('#' + id + ' img').remove()
    $('#' + id).append(`
      <img id="up-arrow" src="https://media.discordapp.net/attachments/651993623021355018/683385228387024912/unknown.png?width=422&height=422"/>
    `)

    $('#' + id).css("background", "rgba(0, 171, 250, 0.205)")

    infoOpened = id;
  } else {
    if(infoOpened) {
      $('#' + id).css("background", "transparent")
      $('#' + id + ' img').remove()
      $('#' + infoOpened + 'info').remove();
      
    }

    $('#' + id).css("background", "transparent");
    $('#' + id + 'info').remove();
    infoOpened = ``;
  }

}

socket.on('catch-user-info', function(info) {
  if(info.rank != "disabled" && info.rank != "manager" && info.rank != "content_creator" && info.rank != "administrator") {
    $(`
    <div id="${info.userid}info" class="userinfo">
      <div class="info-bit">
        <h2 class="important-title">Email : </h2> <p class="desc">${info.email}</p>
      </div>
      <div class="info-bit">
        <h2 class="important-title">User ID : </h2> <p class="desc">${info.userid}</p>
      </div>
      <div class="info-bit">
        <h2 class="important-title">Bio : </h2> <p class="desc">${info.bio}</p>
      </div>
      <div class="info-bit">
        <h2 class="important-title">Rank : </h2> <p class="desc">${info.rank}</p>
      </div>

      <div class="info-bit">
        <div id="ban" onclick="banForm('${info.userid}', '${info.username}')">DISABLE</div>
        <div id="warn">WARN</div>
        <div id="rank">RANK</div>
        <div id="offenses">OFFENSES</div>
      </div>
    </div>
  `).insertAfter('#' + info.userid)
  } else if(info.rank == "manager" || info.rank == "content_creator" || info.rank == "administrator") {
    $(`
    <div id="${info.userid}info" class="userinfo">
      <div class="info-bit">
        <h2 class="important-title">Email : </h2> <p class="desc">${info.email}</p>
      </div>
      <div class="info-bit">
        <h2 class="important-title">User ID : </h2> <p class="desc">${info.userid}</p>
      </div>
      <div class="info-bit">
        <h2 class="important-title">Bio : </h2> <p class="desc">${info.bio}</p>
      </div>
      <div class="info-bit">
        <h2 class="important-title">Rank : </h2> <p class="desc">${info.rank}</p>
      </div>

      <div class="info-bit">
        <div id="give-rank">RANK</div>
      </div>
    </div>
  `).insertAfter('#' + info.userid)
  } else {
    $(`
    <div id="${info.userid}info" class="userinfo">
      <div class="info-bit">
        <h2 class="important-title">Email : </h2> <p class="desc">${info.email}</p>
      </div>
      <div class="info-bit">
        <h2 class="important-title">User ID : </h2> <p class="desc">${info.userid}</p>
      </div>
      <div class="info-bit">
        <h2 class="important-title">Bio : </h2> <p class="desc">${info.bio}</p>
      </div>
      <div class="info-bit">
        <h2 class="important-title">Rank : </h2> <p class="desc">${info.rank}</p>
      </div>

      <div class="info-bit">
        <div id="revoke" onclick="enableAccount('${info.userid}', '${info.username}')">REVOKE CONSEQUENCE</div>
        <div id="warn">WARN</div>
        <div id="rank">RANK</div>
        <div id="offenses">OFFENSES</div>
      </div>
    </div>
  `).insertAfter('#' + info.userid)
  }

  
})

function banForm(id, username) {
  $('#panel-nav-page').html('Page : Disable Account Form');
  $('#panel-right').empty();
  $('#panel-right').append(`
    <h2 id="consequence-title"> Disable ${username}'s Account </h2>
    <h2 id="consequence-sub-title">REASON</h2>
    <div id="reason-box" contenteditable="true" data-text="Please state one reason why ${username}'s account is being disabled."></div>
    <h2 id="consequence-sub-title">BAN LENGTH</h2>
    <div id="length-box" contenteditable="true" data-text="BAN LENGTH"></div>
    <div id="disable-account-button" onclick="disableAccount('${id}', '${username}', 'Disable Account')">DISABLE ACCOUNT</div>
  `)

  $('#panel-left').empty();
  $('#panel-left').append(`
    <div class="panel-option" id="cancel-option" onclick="cancelForm()">
      <p>Cancel</p>
    </div>
  `)
}

function cancelForm() {

  peopleOptionClicked();

  $('#panel-left').empty();
  $('#panel-left').append(`
    <div class="panel-option" id="people-option" onclick="peopleOptionClicked()">
      <p>People</p>
    </div>
    <div class="panel-option" id="administrators-option" onclick="adminOptionClicked()">
      <p>Administrators</p>
    </div>
    <div class="panel-option" id="administrators-option" onclick="disabledOptionClicked()">
      <p>Disabled Accounts</p>
    </div>
    <div class="panel-option" id="audit-log-option" onclick="getAuditLog()">
      <p>Audit Log</p>
    </div>
    
  `)
}

function disableAccount(userid, username, type) {
  reason = document.getElementById("reason-box").innerHTML
  length = $('#length-box').html()

  $('#panel-right').empty();
  $('#panel-right').append(`
    <h2 id="saftey-title"> Are you sure you would like to disable ${username}'s account? </h2>
    <div id="confirm-disable-account-button" onclick="disableUserAccount('${userid}', '${type}', '${reason}', '${length}')">Yes, disable this account</div>
    <div id="cancel-disable-account-button" onclick="cancelForm()">No, don't disable this account</div>
  `)
}

function disableUserAccount(userid, type, reason, length) {
  socket.emit("disable-account", {
    userid: userid,
    token : getCookie('session'),
    type : type,
    reason : reason,
    length : length
  })
}

socket.on("account-disabled", function() {
  cancelForm()
})

function getAuditLog() {
  socket.emit("fetch-audit-log")
}

socket.on('catch-audit-log', function(info) {
  $('#panel-nav-page').html('Page : Audit Log');
  $('#panel-right').empty();
  
  for(action of info.auditLog) {
    if(action[2] == "Disable Account") {
      $('#panel-right').append(`
        <div class="action">
          <p>${action[1]} disabled ${action[0]}'s account </p>
        </div>
      `)
    } else if(action[2] == "enable-account") {
      $('#panel-right').append(`
        <div class="action">
          <p>${action[1]} enabled ${action[0]}'s account </p>
        </div>
      `)
    } 
    
  }
})

function disabledOptionClicked() {
  $('#panel-nav-page').html('Page : Disabled Accounts')
  $('#panel-right').empty()

  socket.emit('fetch-people', {
    filter : "disabled-accounts"
  })
}

function enableAccount(userid, token) {
  socket.emit("enable-account", {
    userid : userid,
    token : getCookie("session")
  })
}

socket.on("account-enabled", function(info) {
  peopleOptionClicked()
})

$('#panel-nav-exit').click(function() { 
  $( "#admin-panel" ).animate({
    bottom: "-500vh"
  }, 400)

  $( "#toggle-admin-panel" ).animate({
    bottom: "0vh"
  }, 400)
})

$('#toggle-admin-panel').click(function() { 
  $( "#admin-panel" ).animate({
    bottom: "22vh"
  }, 400)

  $( "#toggle-admin-panel" ).animate({
    bottom: "-10vh"
  }, 400)
})

/* CMD LINE */

function getCmdLine() {
  if(cmdlineJS.length < 10) {
    $('#panel-right').html(`
      <div id="cmd-input" class="cmd-line" contenteditable="true" data-text=" > type a command" spellcheck="false"></div>
    `)
  } else {
    $('#panel-right').html(`
      ${cmdlineJS}
      
    `)
  }
  
  
  if($('#cmd-input')) setCmdLineEventListener()
  
}

function runCmd(cmd) {
  if(cmd.includes('print(') && cmd.includes(')')) {
    $(`<div id="cmd-prompt" class="cmd-prompt-history-success">${cmd.match(/\'(.*?)\'|\"(.*?)\"/gi)}</div>`).insertBefore('#cmd-input')
  } else if (cmd.includes('setAccountDeletionRange(') && cmd.includes(')')) {
    let matchedCase = '' + cmd.match(/\(.*?\)/gi)
    let returnCase1 = matchedCase.replace("(", ""), 
        returnCase2 = returnCase1.replace(")", "")
    
    if(returnCase2 > 150) {
      $(`<div id="cmd-prompt" class="cmd-prompt-history-error"> You cannot delete more than 50 accounts.</div>`).insertBefore('#cmd-input')
    } else {
      accountDeletionRange = returnCase2;

      $(`<div id="cmd-prompt" class="cmd-prompt-history-success"> Account deletion range set to : ${returnCase2}</div>`).insertBefore('#cmd-input')
    }
    
  } else if (cmd.includes('stageAccountsForDeletion(') && cmd.includes(')')) {
    $(`<div id="cmd-prompt" class="cmd-prompt-history-warning"> Staged ${accountDeletionRange} accounts for deletion: </div>`).insertBefore('#cmd-input')
    
    socket.emit('stage-accounts-for-deletion', {
      amount: accountDeletionRange,
      token: getCookie('session')
    })

  } else if (cmd.includes('orderMostRecentAccounts(') && cmd.includes(')')) {
    let matchedCase = '' + cmd.match(/\(.*?\)/gi)
    let returnCase1 = matchedCase.replace("(", ""), 
        returnCase2 = returnCase1.replace(")", "")
    
    if(returnCase2 > 150) {
      $(`<div id="cmd-prompt" class="cmd-prompt-history-error"> You cannot order more than 150 accounts.</div>`).insertBefore('#cmd-input')
    } else {
      $(`<div id="cmd-prompt" class="cmd-prompt-history-success"> Fetching last ${returnCase2} accounts</div>`).insertBefore('#cmd-input')

      socket.emit('fetchaccounts', {
        amount: returnCase2
      })
    }

  }  else if (cmd.includes('approve(') && cmd.includes(')')) {
    let matchedCase = '' + cmd.match(/\(.*?\)/gi)

    let returnCase1 = matchedCase.replace("(", ""), 
        returnCase2 = returnCase1.replace(")", "")
    uniqueKey = returnCase2;

    socket.emit('approve', {
      key: uniqueKey,
      token: getCookie('session')
    })

  } else if (cmd.includes('/help')) {
    $(`<div id="cmd-prompt" class="cmd-prompt-history-success">All commands will be listed below</div>`).insertBefore('#cmd-input')
    $(`<div id="cmd-prompt" class="cmd-prompt-history-help-cmd"> - print(<span id="string">string</span>)</div>`).insertBefore('#cmd-input')
    $(`<div id="cmd-prompt" class="cmd-prompt-history-help-cmd"> - setAccountDeletionRange(<span id="int">int</span>)</div>`).insertBefore('#cmd-input')
    $(`<div id="cmd-prompt" class="cmd-prompt-history-help-cmd"> - stageAccountsForDeletion(<span id="void">void</span>)</div>`).insertBefore('#cmd-input')
    $(`<div id="cmd-prompt" class="cmd-prompt-history-help-cmd"> - orderMostRecentAccounts(<span id="int">int</span>)</div>`).insertBefore('#cmd-input')
  } else {
    $(`<div id="cmd-prompt" class="cmd-prompt-history-error">${cmd} is not a valid command</div>`).insertBefore('#cmd-input')
  }

  setCmdLineJs()
  
}

function stripHtml(html) {
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

function setCmdLineEventListener() { 
  document.getElementById("cmd-input").addEventListener("keydown", function() {
    var keycode = (event.keyCode ? event.keyCode : event.which);

    if(keycode == "13") {
      if(event.shiftKey) {} else if($('#cmd-input').html() != "") {
        $(`<div id="cmd-prompt" class="cmd-prompt-history">${stripHtml(document.getElementById("cmd-input").innerHTML)}</div>`).insertBefore('#cmd-input')

        runCmd(stripHtml(document.getElementById("cmd-input").innerHTML))
        
        setCmdLineJs()

        document.execCommand('insertHTML', false, '<br><br>');
        document.getElementById('cmd-input').innerHTML = ""
        $('#cmd-input').empty();
        return false;

      } else if($('#cmd-input').html() == "") {
        
        document.execCommand('insertHTML', false, '<br><br>');
        document.getElementById('cmd-input').innerHTML = ""
        return false;
      }
    
      
    } else if(keycode == "57") {
      if(event.shiftKey) {
        let str = $('#cmd-input').text()
        insertCharacter(str, ")", document.getSelection().focusOffset, "cmd-input")
      }
      
    } else if(keycode == "222") {
      if(event.shiftKey) {
        $('#cmd-input').append('"')
      } else {
        $('#cmd-input').append("'")
      }
      
    }

    
  })
}

socket.on('catch-account-names', function(data) {
  if(data.type == "deletion") {
    for(user of data.accounts) {
      STAGED_ACCOUNTS.push([user[1].userid])
      $(`<div id="cmd-prompt" class="cmd-prompt-history-error-nm">${' - ' + user[1].username}</div>`).insertBefore('#cmd-input')
      $('#panel-right').scrollTop($('#panel-right').prop("scrollHeight"));
    }

    $(`<div id="cmd-prompt" class="cmd-prompt-history-success">Approval needed, please send ${data.uniqueKey} to project owner</div>`).insertBefore('#cmd-input')
    $('#panel-right').scrollTop($('#panel-right').prop("scrollHeight"));
  } else if(data.type == "search-request") {
    for(user of data.accounts) {
      STAGED_ACCOUNTS.push([user[1].userid])
      $(`<div id="cmd-prompt" class="cmd-prompt-history-success-nm">${' - ' + user[1].username}</div>`).insertBefore('#cmd-input')
      $('#panel-right').scrollTop($('#panel-right').prop("scrollHeight"));
    }
  }

  setCmdLineJs()
  
})

socket.on('key-approved', function(info) {
  $(`<div id="cmd-prompt" class="cmd-prompt-history-success">Your key was approved, initiating countdown before accounts removal.</div>`).insertBefore('#cmd-input')
  $('#panel-right').scrollTop($('#panel-right').prop("scrollHeight"));
  let tik = info.countdown;
  let a = setInterval(function() {
    tik--;
    tik != 0 ? $(`<div id="cmd-prompt" class="cmd-prompt-history-error-nm"> - ${tik}</div>`).insertBefore('#cmd-input') : $(`<div id="cmd-prompt" class="cmd-prompt-history-error">Removing accounts, please wait..</div>`).insertBefore('#cmd-input')

    $('#panel-right').scrollTop($('#panel-right').prop("scrollHeight"));
    if(tik == 0) clearInterval(a), socket.emit('remove-accounts', {users: STAGED_ACCOUNTS})
    setCmdLineJs()
  }, 1000)
  setCmdLineJs()
})

socket.on('access-denied', function() {
  $(`<div id="cmd-prompt" class="cmd-prompt-history-error">You do not have the authorization to approve keys.</div>`).insertBefore('#cmd-input')
  $('#panel-right').scrollTop($('#panel-right').prop("scrollHeight"));
  setCmdLineJs()
})

socket.on('accounts-successfully-removed', function() {
  $(`<div id="cmd-prompt" class="cmd-prompt-history-success">Accounts successfully removed</div>`).insertBefore('#cmd-input')
  $('#panel-right').scrollTop($('#panel-right').prop("scrollHeight"));
  setCmdLineJs()
})

function setCmdLineJs() {
  $('#cmd-input').html(null)
  cmdlineJS = $('#panel-right').html()
  
}

function insert(str, index, value) {
  return str.substr(0, index) + value + str.substr(index);
}

function insertCharacter(string, character, pos, elementID) {
  let element = document.createElement("div")
  element.id = "newElementId"
  element.innerHTML = ")" + string.substring(string.length, pos)

  $(`#${elementID}`).append(element.innerHTML)
  
  element.remove()
}