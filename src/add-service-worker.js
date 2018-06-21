self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  if (self.clients && clients.claim) {
    clients.claim();
  }
});

const pendingMembers = {};

self.addEventListener("message", (event) => {
  const memberInfo = { member: event.data, port: event.ports[0] };
  pendingMembers[memberInfo.member.id] = memberInfo;
  self.registration.sync.register(memberInfo.member.id);
});

self.addEventListener("sync", (event) => {
  const memberId = event.tag;
  const memberInfo = pendingMembers[memberId];
  event.waitUntil(addMember(memberInfo));
});

const addMember = (memberInfo) => {
  return fetch("http://54.244.61.77:8080/api/members", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(memberInfo.member)
    })
    .then((response) => {
      memberInfo.port.postMessage({ member: memberInfo.member });
      delete pendingMembers[memberInfo.member.id];
    })
    .catch((error) => {
      // The promise needs to fail. Otherwise, the retry will not be scheduled.
      throw error;
    });
};