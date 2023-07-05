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

        <button class="position-absolute end-0">
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
import { register } from "vue-advanced-chat";
register();

// Or if you used CDN import
// window['vue-advanced-chat'].register()

export default {
  data() {
    return {
      currentUserId: "1234",
      rooms: [
        {
          roomId: 1,
          roomName: "Room 1",
          avatar: "assets/imgs/people.png",
          unreadCount: 4,
          index: 3,
          lastMessage: {
            content: "Last message received",
            senderId: 1234,
            username: "John Doe",
            timestamp: "10:20",
            saved: true,
            distributed: false,
            seen: false,
            new: true,
          },
          users: [
            {
              _id: 1234,
              username: "John Doe",
              avatar: "assets/imgs/doe.png",
              status: {
                state: "online",
                lastChanged: "today, 14:30",
              },
            },
            {
              _id: 4321,
              username: "John Snow",
              avatar: "assets/imgs/snow.png",
              status: {
                state: "offline",
                lastChanged: "14 July, 20:00",
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
  methods: {
    async logout() {
      console.log("logout",this.$store);
     await this.$store.dispatch("logOut");
     location.reload();
    },
    onFetchMessages({ room, options = {} }) {
      console.log(room, options);
      this.selectedRoom = room;
      setTimeout(() => {
        this.messages = [
          {
            _id: 7890,
            indexId: 12092,
            content: "Message 1",
            senderId: 1234,
            username: "John Doe",
            avatar: "assets/imgs/doe.png",
            date: "13 November",
            timestamp: "10:20",
            system: false,
            saved: true,
            distributed: true,
            seen: true,
            deleted: false,
            disableActions: false,
            disableReactions: false,
            files: [
              {
                name: "My File",
                size: 67351,
                type: "png",
                audio: true,
                duration: 14.4,
                url: "https://firebasestorage.googleapis.com/v0/b/vuexfire-a9c43.appspot.com/o/files%2F6R0MijpK6M4AIrwaaCY2%2F5RM2yf2TBCVmAUpaHbCD%2Fimage.png?alt=media&token=141dc7d8-1665-438b-871e-6e8566fabd2c",
                preview:
                  "https://firebasestorage.googleapis.com/v0/b/vuexfire-a9c43.appspot.com/o/files%2F6R0MijpK6M4AIrwaaCY2%2F5RM2yf2TBCVmAUpaHbCD%2Fimage.png?alt=media&token=141dc7d8-1665-438b-871e-6e8566fabd2c",
              },
            ],
            reactions: {
              "😁": [
                1234, // USER_ID
                4321,
              ],
              "🥰": [1234],
            },
            replyMessage: {
              content: "Reply Message",
              senderId: 4321,
              files: [
                {
                  name: "My Replied File",
                  size: 67351,
                  type: "png",
                  audio: true,
                  duration: 14.4,
                  url: "https://firebasestorage.googleapis.com/v0/b/vuexfire-a9c43.appspot.com/o/files%2F6R0MijpK6M4AIrwaaCY2%2F5RM2yf2TBCVmAUpaHbCD%2Fimage.png?alt=media&token=141dc7d8-1665-438b-871e-6e8566fabd2c",
                  preview:
                    "https://firebasestorage.googleapis.com/v0/b/vuexfire-a9c43.appspot.com/o/files%2F6R0MijpK6M4AIrwaaCY2%2F5RM2yf2TBCVmAUpaHbCD%2Fimage.png?alt=media&token=141dc7d8-1665-438b-871e-6e8566fabd2c",
                },
              ],
            },
          },
        ];
        this.messagesLoaded = true;
        // this.rooms[0].lastMessage = null;
        // this.rooms[0].unreadCount = null;
      });
    },
    sendMessage(message) {
      console.log(message);
      this.messages = [
        ...this.messages,
        {
          _id: this.messages.length,
          content: message.content,
          senderId: this.currentUserId,
          files: message.files
            ? [
                // {
                //   name: message.files[0].name,
                //   size: 67351,
                //   type: message.files[0].extension,
                //   audio: true,
                //   duration: 14.4,
                //   // url: "https://firebasestorage.googleapis.com/v0/b/vuexfire-a9c43.appspot.com/o/files%2F6R0MijpK6M4AIrwaaCY2%2F5RM2yf2TBCVmAUpaHbCD%2Fimage.png?alt=media&token=141dc7d8-1665-438b-871e-6e8566fabd2c",
                //   url:message.files[0].localUrl,
                //   preview:message.files[0].localUrl,
                //     // "https://firebasestorage.googleapis.com/v0/b/vuexfire-a9c43.appspot.com/o/files%2F6R0MijpK6M4AIrwaaCY2%2F5RM2yf2TBCVmAUpaHbCD%2Fimage.png?alt=media&token=141dc7d8-1665-438b-871e-6e8566fabd2c",
                // },
                {
                  name: message.files[0].name,
                  size: message.files[0].size,
                  type: message.files[0].extension
                    ? message.files[0].extension
                    : "mp3",
                  audio: message.files[0].audio
                    ? message.files[0].extension
                    : false,
                  duration: message.files[0].duration,
                  // url: "https://firebasestorage.googleapis.com/v0/b/vuexfire-a9c43.appspot.com/o/files%2F6R0MijpK6M4AIrwaaCY2%2F5RM2yf2TBCVmAUpaHbCD%2Fimage.png?alt=media&token=141dc7d8-1665-438b-871e-6e8566fabd2c",
                  url: message.files[0].localUrl,
                  preview: message.files[0].localUrl,
                  // "https://firebasestorage.googleapis.com/v0/b/vuexfire-a9c43.appspot.com/o/files%2F6R0MijpK6M4AIrwaaCY2%2F5RM2yf2TBCVmAUpaHbCD%2Fimage.png?alt=media&token=141dc7d8-1665-438b-871e-6e8566fabd2c",
                },
              ]
            : null,
          timestamp: new Date().toString().substring(16, 21),
          date: new Date().toDateString(),
        },
      ];
    },
  },
};
</script>
