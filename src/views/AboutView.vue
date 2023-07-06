<template>
  <div class="d-flex bd-highlight">
    <div class="p-2 flex-grow-1 bd-highlight">
      <h1>Agora Web chat</h1>
    </div>
    <div class="p-2 bd-highlight">
      <button @click="logout()" class="btn btn-danger">logout</button>
    </div>
  </div>

  <vue-advanced-chat
    :height="'calc(100vh - 5vh)'"
    :current-user-id="currentUserId"
    :rooms="JSON.stringify(rooms)"
    :messages="JSON.stringify(messages)"
    :room-actions="JSON.stringify(roomActions)"
    :messages-loaded="messagesLoaded"
    :rooms-loaded="roomsLoaded"
    :loading-rooms="loadingRooms"
    @fetch-messages="onFetchMessages($event.detail[0])"
    @send-message="sendMessage($event.detail[0])"
  >
    <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
    <div v-if="selectedRoom" slot="room-header-info">
      <div class="">
        {{ selectedRoom.roomName }}

        <button class="btn btn-primary position-absolute end-0">
          <i class="bi bi-camera-video-fill"></i>
        </button>
      </div>
    </div>
    <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->

    <!-- <template :slot="room-header">
      <div>This is a new room header</div>
    </template> -->
  </vue-advanced-chat>
</template>

<script>
import AgoraServer from "../server/agora.server";
import AC from "agora-chat";

const conn = new AC.connection({
  appKey: process.env.VUE_APP_KEY,
});
conn.addEventHandler("connection&message", {
  onConnected: () => {
    console.log("connected");
  },
  // Occurs when the app is disconnected from Agora Chat.
  onDisconnected: () => {
    // this.$store.dispatch("logOut");
    location.reload();
    this.handleLogin();
  },
  onTextMessage: (message) => {
    console.log(message);
  },
  onTokenWillExpire: () => {
    alert("Token is about to expire");
  },
  onTokenExpired: () => {
    this.logout();
    alert('"The token has expired"');
  },
  onImageMessage: (message) => {
    console.log(message);
  },
  onAudioMessage: (message) => {
    console.log(message);
  },
  onError: (error) => {
    console.log("on error", error);
  },
});
import { register } from "vue-advanced-chat";
register();

// Or if you used CDN import
// window['vue-advanced-chat'].register()

export default {
  data() {
    return {
      currentUserId: "",
      rooms: [
        {
          roomId: localStorage.getItem("AgoraUserId"),
          roomName: localStorage.getItem("AgoraUserId"),
          avatar: "assets/imgs/people.png",
          // unreadCount: 4,
          index: 3,
          lastMessage: {
            // content: "Last message received",
            // senderId: 1234,
            // username: "John Doe",
            // timestamp: "10:20",
            // saved: true,
            // distributed: false,
            // seen: false,
            // new: true,
          },
          users: [
            {
              _id: localStorage.getItem("AgoraUserId"),
              username: localStorage.getItem("AgoraUserId"),
              avatar: "assets/imgs/doe.png",
              status: {
                state: "offline",
                lastChanged: "today, 23:30",
              },
              
            },
            {
              _id: "mn",
              username: localStorage.getItem("AgoraUserId"),
              avatar: "assets/imgs/doe.png",
              status: {
                state: "offline",
                lastChanged: "today, 23:30",
              },
            },
          ],
          typingUsers: [4321],
        },
      ],
      roomsLoaded: true,
      messagesLoaded: false,
      loadingRooms: false,
      messages: [],
      roomActions: [
        { name: "inviteUser", title: "Invite User" },
        { name: "removeUser", title: "Remove User" },
        { name: "deleteRoom", title: "Delete Room" },
      ],
      selectedRoom: null,
    };
  },
  async mounted() {
    this.currentUserId = localStorage.getItem("AgoraUserId");
    AgoraServer.logout();
    await AgoraServer.handleLogin();
    const data = await AgoraServer.retrieveIndividualChat("agora");
    console.log("data", data);
    await AgoraServer.fetchRooms("john").then((res, err) => {
      if (res) {
        res?.users?.map((user) => {
          this.rooms.push({
            roomName: user,
            roomId: user,
            // unreadCount: 4,
            // index: 3,
            lastMessage: {
              // content: "Last message received",
              // senderId: 1234,
              // username: "John Doe",
              // timestamp: "10:20",
              // saved: true,
              // distributed: false,
              // seen: false,
              // new: true,
            },
            avatar: "https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj",
            users: [
              {
                _id: this.currentUserId,
                username: this.currentUserId,
                avatar: "assets/imgs/doe.png",
                status: {
                  state: "offline",
                  lastChanged: "today, 23:30",
                },
              },
              {
                _id: user,
                username: user,
                avatar: "assets/imgs/snow.png",
                status: {
                  state: "offline",
                  lastChanged: "14 July, 20:00",
                },
              },
            ],
            typingUsers: [4321],
          });
        });
      } else {
        console.log(err);
      }
    });
  },
  methods: {
    async logout() {
      console.log("logout", this.$store);
      await this.$store.dispatch("logOut");
      location.reload();
    },
    onFetchMessages({ room, options = {} }) {
      console.log(room, options);
      this.selectedRoom = room;
      this.messages = [];
      const messages = [];
      AgoraServer.retrieveIndividualChat(room.roomId).then((res) => {
        console.log(res);
        res.messages.forEach((msg) => {
          setTimeout(() => {
            this.messages.push({
              _id: msg.id,
              indexId: msg.id,
              content: msg.msg ? msg.msg : null,
              senderId: msg.from,
              username: msg.from,
              avatar: "assets/imgs/doe.png",
              date: new Date(msg.time),
              timestamp:
                new Date(msg.time).getHours() +
                ":" +
                new Date(msg.time).getMinutes(),
              // system: false,
              saved: true,
              distributed: true,
              // seen: true,
              // deleted: false,
              // disableActions: false,
              // disableReactions: false,
              files: msg.ext?.file_type
                ? [
                    {
                      name: msg?.ext?.file_name,
                      size: msg.ext?.file_size,
                      type: msg.ext?.file_type,
                      audio: true,
                      duration: msg.ext?.duration,
                      url: msg.thumb,
                      // url: "https://firebasestorage.googleapis.com/v0/b/vuexfire-a9c43.appspot.com/o/files%2F6R0MijpK6M4AIrwaaCY2%2F5RM2yf2TBCVmAUpaHbCD%2Fimage.png?alt=media&token=141dc7d8-1665-438b-871e-6e8566fabd2c",
                      preview: msg.thumb,
                      // "https://firebasestorage.googleapis.com/v0/b/vuexfire-a9c43.appspot.com/o/files%2F6R0MijpK6M4AIrwaaCY2%2F5RM2yf2TBCVmAUpaHbCD%2Fimage.png?alt=media&token=141dc7d8-1665-438b-871e-6e8566fabd2c",
                    },
                  ]
                : [],
              reactions: {},
              replyMessage: {
                // content: "Reply Message",
                // senderId: 4321,
                // files: [
                //   {
                //     name: "My Replied File",
                //     size: 67351,
                //     type: "png",
                //     audio: true,
                //     duration: 14.4,
                //     url: "https://firebasestorage.googleapis.com/v0/b/vuexfire-a9c43.appspot.com/o/files%2F6R0MijpK6M4AIrwaaCY2%2F5RM2yf2TBCVmAUpaHbCD%2Fimage.png?alt=media&token=141dc7d8-1665-438b-871e-6e8566fabd2c",
                //     preview:
                //       "https://firebasestorage.googleapis.com/v0/b/vuexfire-a9c43.appspot.com/o/files%2F6R0MijpK6M4AIrwaaCY2%2F5RM2yf2TBCVmAUpaHbCD%2Fimage.png?alt=media&token=141dc7d8-1665-438b-871e-6e8566fabd2c",
                //   },
                // ],
              },
            });

            this.messagesLoaded = true;
            // this.rooms[0].lastMessage = null;
            // this.rooms[0].unreadCount = null;
          });
        });
      });
      console.log("messages", messages);
    },
    async sendMessage(message) {
      console.log("file", message);
      if (message.content) {
        await AgoraServer.sendMessage(message.roomId, message.content).then(
          (res) => {
            console.log(res);
          }
        );
        this.messages = [
          ...this.messages,
          {
            _id: this.messages.length,
            content: message.content,
            senderId: this.currentUserId,
            files: null,
            timestamp: new Date().toString().substring(16, 21),
            date: new Date().toDateString(),
          },
        ];
      } else {
        await message.files.forEach(async (file) => {
          console.log(file);

          if (file.audio) {
            await AgoraServer.sendAudio("agora", message.files);
            this.messages = [
              ...this.messages,
              {
                _id: this.messages.length,
                content: message.content,
                senderId: this.currentUserId,
                files: message.files ? AgoraServer.formattedFiles(file) : null,
                timestamp: new Date().toString().substring(16, 21),
                date: new Date().toDateString(),
              },
            ];
          } else {
            console.log(file);
            await AgoraServer.sendImage("agora", file);
            this.messages = [
              ...this.messages,
              {
                _id: this.messages.length,
                content: message.content,
                senderId: this.currentUserId,
                files: message.files ? AgoraServer.formattedFiles(file) : null,
                timestamp: new Date().toString().substring(16, 21),
                date: new Date().toDateString(),
              },
            ];
          }
        });
      }
      // console.log(message);
    },
  },
};
</script>
