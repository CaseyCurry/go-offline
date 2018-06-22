const list = document.getElementsByClassName("example-container")[0].children[0];

const uuidv4 = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11)
    .replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4)
      .toString(16)
    )
};

const addHeader = () => {
  const item = document.createElement("li");
  item.classList.add("row", "header");
  item.innerHTML =
    `<span class="col-12 col-sm-5">Name</span>
    <span class="col-12 col-sm-3">Gender</span>
    <span class="col-12 col-sm-2">Age</span>`;
  list.appendChild(item);
};

const addToList = (id, name, gender, age) => {
  const item = document.createElement("li");
  item.classList.add("row");
  item.id = id;
  item.innerHTML =
    `<span class="col-12 col-sm-5">${name}</span>
    <span class="col-12 col-sm-3">${gender}</span>
    <span class="col-12 col-sm-2">${age}</span>`;
  list.insertBefore(item, list.children[1]);
};

const getMembers = () => {
  fetch("http://54.244.61.77:8080/api/members")
    .then((response) => {
      return response.json();
    })
    .then((members) => {
      const sorted = members.sort((a, b) => {
        return (a.timeCreated > b.timeCreated) ?
          1 :
          (b.timeCreated > a.timeCreated ? -1 : 0);
      });
      sorted.forEach(x => {
        addToList(x.id, x.name, x.gender, x.age, x.timeCreated);
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

const getNewMemberObject = () => {
  const name = document.getElementById("name")
    .value;
  const gender = document.getElementById("gender")
    .value;
  const age = document.getElementById("age")
    .value;
  if (!name || !gender || !age) {
    return;
  }
  const id = uuidv4();
  const timeCreated = new Date()
    .getTime();
  const member = {
    id,
    name,
    gender,
    age,
    timeCreated
  };
  return member;
};

const clearNewMember = () => {
  document.getElementById("name")
    .value = "";
  document.getElementById("gender")
    .value = "";
  document.getElementById("age")
    .value = "";
};

const updateMemberToSynced = (id) => {
  document.getElementById(id)
    .classList.add("synced");
  document.getElementById(id)
    .classList.remove("unsynced");
};

const setTheSyncStatus = (member) => {
  // Give the service worker enough time to process before determining if
  // the member was synced.
  setTimeout(() => {
    const memberElement = document.getElementById(member.id);
    if (!memberElement.classList.contains("synced")) {
      memberElement.classList.add("unsynced");
    }
  }, navigator.onLine ? 500 : 0);
};

const createNewMember = (member) => {
  const messageChannel = new MessageChannel()
  messageChannel.port1.onmessage = (event) => {
    updateMemberToSynced(event.data.member.id);
  };
  navigator.serviceWorker.controller.postMessage(member, [messageChannel.port2]);
};

addHeader();

getMembers();

window.addEventListener("load", () => {
  navigator.serviceWorker.register("./add-service-worker.js")
    .then((registration) => navigator.serviceWorker.ready)
    .then((registration) => {
      document.getElementById("submitButton")
        .addEventListener("click", () => {
          const member = getNewMemberObject();
          createNewMember(member);
          addToList(member.id, member.name, member.gender, member.age);
          clearNewMember();
          setTheSyncStatus(member);
        });
    })
    .catch(function(error) {
      console.log(error);
    });
});