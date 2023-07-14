<template>
  <div class="d-flex bd-highlight">
    <div class="p-2 flex-grow-1 bd-highlight">
      <h1>Agora Web chat</h1>
    </div>

    <div class="p-2 bd-highlight">
      <button
        @click="
          () => {
            this.theme = 'light';
          }
        "
        class="btn btn-light"
      >
        Light
      </button>
    </div>
    <div class="p-2 bd-highlight">
      <button
        @click="
          () => {
            this.theme = 'dark';
          }
        "
        class="btn btn-dark"
      >
        Dark
      </button>
    </div>
    <div class="p-2 bd-highlight">
      <button @click="logout()" class="btn btn-danger">
        logout <span class="text-success">{{ this.currentUserId }}</span>
      </button>
    </div>
  </div>

  <div class="container auto" v-if="showNewUsers">
    <div class="row">
      <div class="col-sm-12 col-md-4">
        <v-autocomplete
          label="Select New Chat"
          no-data-text="..."
          :items="newUsers"
          variant="solo"
          clearable
          @update:search="onSearchChannge"
          @click:clear="onSearchClear"
          @update:modelValue="onModalValue"
        ></v-autocomplete>
      </div>
    </div>
  </div>

  <vue-advanced-chat
    :height="'calc(100vh - 5vh)'"
    :theme="theme"
    :current-user-id="currentUserId"
    :rooms="JSON.stringify(rooms)"
    :messages="JSON.stringify(messages)"
    :room-actions="JSON.stringify(roomActions)"
    :menu-actions="JSON.stringify(menuActions)"
    :message-actions="JSON.stringify(messageActions)"
    :messages-loaded="messagesLoaded"
    :rooms-loaded="roomsLoaded"
    :loading-rooms="loadingRooms"
    @fetch-messages="onFetchMessages($event.detail[0])"
    @send-message="sendMessage($event.detail[0])"
    @add-room="addNewChat($event.detail[0])"
    @message-action-handler="messageActionHandler($event.detail[0])"
    @room-action-handler="roomActionsHandler($event.detail[0])"
    @delete-message="deleteMessage($event.detail[0])"
  >
    <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
    <div slot="room-header-info"
      class="d-flex bd-highlight"
      v-if="selectedRoom"
    >
      <div class="p-2 flex-grow-1 bd-highlight">
        {{ selectedRoom.roomName }}
        {{ updatedOnlineStatus[selectedRoom.roomName] }}
      </div>
      <div class="p-2 bd-highlight position-absolute end-0">
        <v-row justify="space-around">
          <v-col cols="auto">
            <v-dialog
              transition="dialog-top-transition"
              width="auto"
              v-model="showDialog"
              persistent
            >
              <template v-slot:activator="{ props }">
                <v-btn @click="makeCall()" color="primary" v-bind="props">
                  <i class="bi bi-camera-video-fill"></i>
                </v-btn>
              </template>
              <template v-slot:="{ isActive }">
                <v-card>
                  <v-toolbar color="primary" :title="callAlertData"></v-toolbar>
                  <v-card-text>
                    <div class="about">
                      <div>
                        <div class="row my-5" v-if="isCallingUser">
                          <div class="col-12">
                            <!-- <p>{{ callingUserNotification }}</p> -->
                            <button
                              type="button"
                              class="btn btn btn-outline-danger"
                              @click="cancelCall()"
                            >
                              <i class="bi bi-telephone-x"></i>
                            </button>
                          </div>
                        </div>
                        <!-- Incoming Call  -->
                        <div class="row my-5" v-if="incomingCall">
                          <div class="col-12">
                            <!-- <p>Incoming Call From <strong>${ incomingCaller }</strong></p> -->
                            <!-- <p>{{ incomingCallNotification }}</p> -->
                            <div class="btn-group" role="group">
                              <button
                                type="button"
                                class="btn btn-danger"
                                data-dismiss="modal"
                                @click="declineCall()"
                              >
                                <i class="bi bi-telephone-x-fill"></i>
                              </button>
                              <button
                                type="button"
                                class="btn btn-success ml-5"
                                @click="acceptCall"
                              >
                                <i class="bi bi-telephone-inbound-fill"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                        <section id="video-container" v-if="callPlaced">
                          <div class="ratio ratio-16x9">
                            <div id="local-video" ref="localVideo">local</div>

<div id="remote-video"   ref="remoteVideo"> remote</div>
                          </div>
                        

                          <div class="action-btns">
                            <button
                              type="button"
                              class="btn btn-info"
                              @click="handleAudioToggle()"
                            >
                              <i v-if="mutedAudio" class="bi bi-mic-mute"></i>
                              <i v-else class="bi bi-mic-fill"></i>
                            </button>
                            <button
                              type="button"
                              class="btn btn-primary mx-4"
                              @click="handleVideoToggle()"
                            >
                              <!-- <i class="bi bi-camera-video-off-fill"></i> -->
                              <i
                                v-if="mutedVideo"
                                class="bi bi-camera-video-off-fill"
                              ></i>
                              <i v-else class="bi bi-camera-video-fill"></i>
                            </button>
                            <button
                              type="button"
                              class="btn btn-danger"
                              @click="endCall()"
                            >
                              <i class="bi bi-telephone-x-fill"></i>
                            </button>
                          </div>
                        </section>
                        <!-- End of Incoming Call  -->
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </template>
            </v-dialog>
          </v-col>
        </v-row>
      </div>
    </div>
    <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
    <!-- <div v-if="selectedRoom" slot="room-header-info">
        <div class="">
          {{ selectedRoom.roomName }} -->

    <!-- <div class=" position-absolute end-0"> -->
    <!-- <i class="bi bi-camera-video-fill"></i> -->
    <!-- <v-row justify="space-around">
              <v-col cols="auto">
                <v-dialog transition="dialog-top-transition" width="auto">
                  <template v-slot:activator="{ props }">
                    <v-btn  color="primary" v-bind="props">
                      <i class="bi bi-camera-video-fill"></i>
                    </v-btn>
                  </template>
                  <template v-slot:default="{ isActive }">
                    <v-card>
                      <v-toolbar
                        color="primary"
                        title="Opening from the top"
                      ></v-toolbar>
                      <v-card-text>
                        <div class="text-h2 pa-12">Hello world!</div>
                      </v-card-text>
                      <v-card-actions class="justify-end">
                        <v-btn variant="text" @click="isActive.value = false"
                          >Close</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
              </v-col>
            </v-row> -->
    <!-- </div> -->
    <!-- </div>
      </div> -->
    <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->

    <!-- <template :slot="room-header">
        <div>This is a new room header</div>
      </template> -->
  </vue-advanced-chat>
</template>

<script>
var jsInstance = {};
import AgoraServer from "../server/agora.server";
import AC from "agora-chat";
import axios from "axios";
import AgoraRTM from "agora-rtm-sdk";
import AgoraRTC from "agora-rtc-sdk-ng";
import { markRaw } from "vue";
import { useNotification } from "@kyvg/vue3-notification";
const { notify } = useNotification();
const conn = new AC.connection({
  appKey: process.env.VUE_APP_KEY,
});

conn.addEventHandler("connection&message", {
  // Occurs when the app is connected to Agora Chat.
  onConnected: () => {
    alert("conected");
    document
      .getElementById("log")
      .appendChild(document.createElement("div"))
      .append("Connect success !");
  },

  // Occurs when the app is disconnected from Agora Chat.
  onDisconnected: () => {
    // login()
    document
      .getElementById("log")
      .appendChild(document.createElement("div"))
      .append("Logout success !");
    // this.login();
  },
  // Occurs when a text message is received.
  onTextMessage: (message) => {
    // alert(message.msg);
    // AgoraServer.fetchRooms("john").then(res=>{
    //   console.log(res)
    // })
    // console.log(jsInstance.testMsg)
    // alert(jsInstance.testMsg)
    console.log(
      "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    );
    // console.log(this)

    //  jsInstance.findUserIndex(message.from)

    console.log(message);

    // alert("Message from: " + message.from + " Message: " + message.msg);
    if (message.to === localStorage.getItem("AgoraUserId")) {
      var Index = jsInstance.rooms.findIndex(
        (user) => user.index === message.from
      );
      // alert(Index);
      if (Index < 0) {
        // alert(Index)
        jsInstance.rooms.push({
          roomName: message.from,
          roomId: message.from,
          unreadCount: jsInstance.rooms[Index].unreadCount + 1,
          index: message.from,
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
              _id: message.from,
              username: message.from,
              avatar: "assets/imgs/snow.png",
              status: {
                state: "offline",
                lastChanged: "14 July, 20:00",
              },
            },
            {
              _id: jsInstance.currentUserId,
              username: jsInstance.currentUserId,
              avatar: "assets/imgs/doe.png",
              status: {
                state: "offline",
                lastChanged: "today, 23:30",
              },
            },
          ],
          typingUsers: [],
        });
      }
      console.log(jsInstance.rooms);
      if (Index >= 0) {
        // alert(Index);

        jsInstance.rooms[Index].lastMessage = {
          content: message.msg,
          senderId: message.from,
          username: message.from,
          timestamp: "10:20",
          saved: true,
          distributed: false,
          seen: false,
          new: true,
        };
      }
      if (jsInstance.selectedRoom.roomName === message.from) {
        jsInstance.messages.push({
          _id: message.from,
          content: message.msg,
          senderId: message.from,
          files: null,
          timestamp:
            new Date(message.time).getHours() +
            ":" +
            new Date(message.time).getMinutes(),
          date: new Date(message.time).toDateString(),
        });
      }

      notify({
        title: "Message from: " + message.from + " Message: " + message.msg,
      });
    }
  },
  onAudioMessage: (message) => {
    // alert("Message from: " + message.from + "sent a voice message");

    if (message.to === localStorage.getItem("AgoraUserId")) {
      notify({
        title: "Message from: " + message.from + "sent a voice message",
      });
      var Index = jsInstance.rooms.findIndex(
        (user) => user.index === message.from
      );
      if (Index < 0) {
        // alert(Index)
        jsInstance.rooms.push({
          roomName: message.from,
          roomId: message.from,
          unreadCount: null,
          index: message.from,
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
              _id: message.from,
              username: message.from,
              avatar: "assets/imgs/snow.png",
              status: {
                state: "offline",
                lastChanged: "14 July, 20:00",
              },
            },
            {
              _id: jsInstance.currentUserId,
              username: jsInstance.currentUserId,
              avatar: "assets/imgs/doe.png",
              status: {
                state: "offline",
                lastChanged: "today, 23:30",
              },
            },
          ],
          typingUsers: [],
        });
      }
      if (jsInstance.selectedRoom.roomName === message.from) {
        jsInstance.messages.push({
          _id: message.from,
          content: message.msg,
          senderId: message.from,
          files: [
            {
              name: message?.ext?.file_name,
              size: message.ext?.file_size,
              type: message.ext?.file_type,
              audio: true,
              duration: message.ext?.duration,
              url: message.thumb,
              // url: "https://firebasestorage.googleapis.com/v0/b/vuexfire-a9c43.appspot.com/o/files%2F6R0MijpK6M4AIrwaaCY2%2F5RM2yf2TBCVmAUpaHbCD%2Fimage.png?alt=media&token=141dc7d8-1665-438b-871e-6e8566fabd2c",
              preview: message.thumb,
            },
          ],
          timestamp:
            new Date(message.time).getHours() +
            ":" +
            new Date(message.time).getMinutes(),
          date: new Date(message.time).toDateString(),
        });
      }
    }
  },
  // Occurs when the token is about to expire.
  onTokenWillExpire: (params) => {
    console.log(params);
    document
      .getElementById("log")
      .appendChild(document.createElement("div"))
      .append("Token is about to expire");
  },
  // Occurs when the token has expired.
  onTokenExpired: (params) => {
    console.log(params);
    document
      .getElementById("log")
      .appendChild(document.createElement("div"))
      .append("The token has expired");
  },
  onImageMessage: (message) => {
    if (message.to === localStorage.getItem("AgoraUserId")) {
      notify({
        title: "Message from: " + message.from + " sent an image ",
      });
      var Index = jsInstance.rooms.findIndex(
        (user) => user.index === message.from
      );
      if (Index < 0) {
        // alert(Index)
        jsInstance.rooms.push({
          roomName: message.from,
          roomId: message.from,
          unreadCount: null,
          index: message.from,
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
              _id: message.from,
              username: message.from,
              avatar: "assets/imgs/snow.png",
              status: {
                state: "offline",
                lastChanged: "14 July, 20:00",
              },
            },
            {
              _id: jsInstance.currentUserId,
              username: jsInstance.currentUserId,
              avatar: "assets/imgs/doe.png",
              status: {
                state: "offline",
                lastChanged: "today, 23:30",
              },
            },
          ],
          typingUsers: [],
        });
      }
      if (jsInstance.selectedRoom.roomName === message.from) {
        jsInstance.messages.push({
          _id: message.from,
          content: message?.msg,
          senderId: message.from,
          files: [
            {
              name: message.ext?.file_name,
              size: message?.ext?.file_size,
              type: message?.ext?.file_type,
              url: message.thumb,
              preview: message.thumb,
            },
          ],
          timestamp:
            new Date(message.time).getHours() +
            ":" +
            new Date(message.time).getMinutes(),
          date: new Date(message.time).toDateString(),
        });
      }
    }
    console.log(message);
  },
  onError: (error) => {
    console.log("on error", error);
  },
  onReceivedMessage: function (message) {
    // alert("onReceived")
    console.log("onREceived", message);
  }, // Received a receipt for message delivery to the server.
  onDeliveredMessage: function (message) {
    // alert("onDeliverd")
    console.log("onDelivered", message);
  }, // Receive a receipt for message delivery to the client.
  onReadMessage: function (message) {
    alert("Receive a receipt for message delivery to the client");
    console.log(message);
  },
  // Occurs when the conversation read receipt is received.
  onChannelMessage: function (message) {
    alert("Occurs when the conversation read receipt is received");
    console.log(message);
  },
});

import { register } from "vue-advanced-chat";
register();

// Or if you used CDN import
// window['vue-advanced-chat'].register()

export default {
  data() {
    return {
      testMsg: "THOR",
      theme: "dark",
      showNewUsers: false,
      newUsers: [],
      currentUserId: "",
      rooms: [
        {
          roomId: localStorage.getItem("AgoraUserId"),
          roomName: localStorage.getItem("AgoraUserId") + " (me)",
          avatar: "assets/imgs/people.png",
          unreadCount: null,
          index: localStorage.getItem("AgoraUserId"),
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
              _id: localStorage.getItem("AgoraUserId") + "(you)",
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
      loadingRooms: true,
      messages: [],
      messageActions: [
        // { name: "select", title: "select" },
        { name: "deleteMessage", title: "Delete Message" },
      ],
      roomActions: [
        { name: "deleteChat", title: "Delete Chat" },
      ],
      menuActions: [
        // { name: "inviteUser", title: "Invite User" },
        // { name: "removeUser", title: "Remove User" },
        { name: "deleteChat", title: "Delete Chat" },
      ],
      selectedRoom: null,
      /// video call data
      AGORA_APP_ID: "6fa37398a5be49d187db7c4f060d8530",
      agora: "agora",
      callPlaced: false,
      localStream: null,
      mutedAudio: false,
      mutedVideo: false,
      onlineUsers: [],
      isLoggedIn: false,
      incomingCall: false,
      incomingCaller: "",
      incomingCallNotification: "",
      // rtmClient: AgoraRTM.createInstance('6fa37398a5be49d187db7c4f060d8530'),
      rtmChannelInstance: null,
      rtcClient: null,
      videousers: [],
      updatedOnlineStatus: {},
      rtmChannelName: null,
      isCallingUser: false,
      callingUserNotification: "",
      localAudioTrack: null,
      localVideoTrack: null,
      remoteVideoTrack: null,
      remoteAudioTrack: null,
      uid: "agora",
      showDialog: false,
      callAlertData: "",
    };
  },
  async mounted() {
    AgoraServer.logout();
    await AgoraServer.handleLogin();
    var id = localStorage.getItem("AgoraUserId");
    var tkn = localStorage.getItem("AgoraToken");
    // alert(id);
    // alert(tkn);
    await conn
      .open({
        user: id,
        agoraToken: tkn,
      })
      .then((res) => {
        localStorage.setItem("agoraUserId", this.currentUserId);
        localStorage.setItem("agoraToken", this.token);
        console.log(res);
      });
    this.currentUserId = localStorage.getItem("AgoraUserId");

    await this.initRtmInstance();
    console.log(this.updatedOnlineStatus);
    await this.fetchVideoCallingUsers();

    await AgoraServer.fetchRooms(this.currentUserId).then((res, err) => {
      if (res) {
        res?.users?.map((user) => {
          this.rooms.push({
            roomName: user,
            roomId: user,
            unreadCount: 0,
            index: user,
            lastMessage: {
              content: "",
              senderId: "null",
              username: "",
              timestamp: "",
              saved: true,
              distributed: false,
              seen: false,
              new: true,
            },
            avatar: "https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj",
            users: [
              {
                _id: user,
                username: user,
                avatar: "assets/imgs/snow.png",
                status: {
                  state: "offline",
                  lastChanged: "14 July, 20:00",
                },
              },
              {
                _id: this.currentUserId,
                username: this.currentUserId,
                avatar: "assets/imgs/doe.png",
                status: {
                  state: "offline",
                  lastChanged: "today, 23:30",
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
    this.loadingRooms = false;
    // assigning vue instance to javascript variable
    jsInstance = this;
    console.log(jsInstance);
  },
  methods: {
    findUserIndex(from) {
      var Index = this.rooms.findIndex((user) => user.index === from);
      alert(Index);
      console.log(Index);
    },

    async logout() {
      console.log("logout", this.$store);
      await this.$store.dispatch("logOut");
      location.reload();
    },
    async onFetchMessages({ room, options = {} }) {
      await this.initRtmInstance();

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
              seen: true,
              deleted: false,
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
            var Index = this.rooms.findIndex(
              (user) => user.index === room.roomId
            );
            console.log(Index);
            var obj = {
              content: "",
              senderId: "",
              username: "",
              timestamp: "",
              saved: true,
              distributed: false,
              seen: true,
              new: false,
            };
            this.rooms[Index].lastMessage = obj;
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
            // saved: true,
            distributed: true,
            //   seen: true,
            //   deleted: false,
            timestamp: new Date().toString().substring(16, 21),
            date: new Date().toDateString(),
          },
        ];
      } else {
        await message.files.forEach(async (file) => {
          console.log(file);

          if (file.audio) {
            await AgoraServer.sendAudio(message.roomId, message.files);
            this.messages = [
              ...this.messages,
              {
                _id: this.messages.length,
                content: message.content,
                senderId: this.currentUserId,
                files: message.files ? AgoraServer.formattedFiles(file) : null,
                timestamp: new Date().toString().substring(16, 21),
                date: new Date().toDateString(),
                saved: true,
                // distributed: true,
                seen: true,
                deleted: false,
              },
            ];
          } else {
            console.log(file);
            await AgoraServer.sendImage(message.roomId, file).then(() => {
              this.messages = [
                ...this.messages,
                {
                  _id: this.messages.length,
                  content: message.content,
                  senderId: this.currentUserId,
                  files: message.files
                    ? AgoraServer.formattedFiles(file)
                    : null,
                  timestamp: new Date().toString().substring(16, 21),
                  date: new Date().toDateString(),
                  saved: true,
                  // distributed: true,
                  seen: true,
                  deleted: false,
                },
              ];
            });
          }
        });
      }
      // console.log(message);
    },
    async addNewChat() {
      this.showNewUsers = true;
      // AgoraServer.fetchUsers().then((res) => {
      //   console.log(res);
      //   res?.data?.entities?.map((user) => {
      //     console.log(user.username);
      //     const isItemPresent = this.rooms.some(
      //       (item) => item.roomName === user.username
      //     );
      //     if (!isItemPresent && user.username !== this.currentUserId) {
      //       // console.log("yes", user.username);
      //       this.newUsers.push(user.username);
      //     }
      //   });
      // });
      const data = await axios.get(
        "https://agora-rtm-rtc-tokens.onrender.com/users",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      data.data.users?.map((user) => {
        console.log(user.account);
        const isItemPresent = this.rooms.some(
          (item) => item.roomName === user.account
        );
        if (!isItemPresent && user.account !== this.currentUserId) {
          // console.log("yes", user.username);
          this.newUsers.push(user.account);
        }
      });
    },
    async deleteMessage(userId, messageId) {
      console.log(userId, messageId);
      let option = {
        mid: messageId,
        to: userId,
        chatType: "singleChat",
      };
      await conn.recallMessage(option).then((res, err) => {
        console.log(res, err);
      });
      // console.log(message)
      //  await AgoraServer.deleteMessage(roomId, message);
      console.log("deleted");
    },
    async messageActionHandler({ roomId, action, message }) {
      console.log(roomId, message);
      switch (action.name) {
        case "select":
          console.log("selected");
          // call a method to add a message to the favorite list
          break;
        case "delete":
          await this.deleteMessage(roomId, message.mid);

        // call a method to share the message with another user
      }
    },
    roomActionsHandler({ roomId, action }) {
      console.log(roomId, action);
      switch (action.name) {
        case "inviteUser":
          break;
        // call a method to invite a user to the room
        case "deleteChat":
          console.log("deleting");
          AgoraServer.deleteChat(roomId).then(() => {
            var Index = this.rooms.findIndex((user) => user.index === roomId);
            this.rooms.splice(Index,1)
          });
          break;
        case "deleteRoom":
      }
    },
    onSearchChannge(item) {
      console.log(item);
    },
    onSearchClear() {
      console.log("search cleared");
    },
    onModalValue(item) {
      console.log("onModalValue", item);
      this.rooms = [
        {
          roomName: item,
          roomId: item,
          avatar: "https://66.media.tumblr.com/avatar_c6a8eae4303e_512.pnj",
          unreadCount: null,
          index: item,
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
              _id: item,
              username: item,
              avatar: "assets/imgs/doe.png",
              status: {
                state: "offline",
                lastChanged: "today, 23:30",
              },
            },
            // { _id: "arjun", username: "arjun" },
          ],
        },
        ...this.rooms,
      ];
      this.showNewUsers = false;
    },
    async makeCall() {
      this.callAlertData=""
      console.log("call");
      this.showDialog = true;
      await this.initRtmInstance();
      await this.placeCall(this.selectedRoom.roomId);
    },
    async fetchVideoCallingUsers() {
      const data = await axios.get(
        "https://agora-rtm-rtc-tokens.onrender.com/users",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (data.data.users) {
        console.log(data);
        this.videousers = data.data.users;
      }
    },
    async initRtmInstance() {
      // initialize an Agora RTM instance
      this.rtmClient = AgoraRTM.createInstance(
        "6fa37398a5be49d187db7c4f060d8530"
      );

      // RTM Channel to be used
      this.rtmChannelName = "videoCallChannel";

      // Generate the RTM token
      const { data } = await this.generateToken(
        this.rtmChannelName,
        this.currentUserId
      );
      console.log(data);

      // Login when it mounts
      await this.rtmClient
        .login({
          uid: this.currentUserId,
          token: data.rtm_token,
        })
        .then(() => {
          console.log("RTM client logged in success ");
        });

      this.isLoggedIn = true;

      // RTM Message Listeners
      this.rtmClient.on("MessageFromPeer", (message, peerId) => {
        console.log("MessageFromPeer");
        console.log("message: ", message);
        console.log("peerId: ", peerId);
      });

      // Display connection state changes
      this.rtmClient.on("ConnectionStateChanged", (state, reason) => {
        console.log("ConnectionStateChanged");
        console.log("state: ", state);
        console.log("reason: ", reason);
      });
      // Emitted when a Call Invitation is sent from Remote User
      this.rtmClient.on("RemoteInvitationReceived", (data) => {
        // alert(`Incoming Call From ${data.callerId}`)
        this.showDialog = true;
        this.remoteInvitation = data;
        this.incomingCall = true;
        this.incomingCaller = data.callerId;
        this.incomingCallNotification = `Incoming Call From ${data.callerId}`;
        this.callAlertData = `Incoming Call From ${data.callerId}`;

        data.on("RemoteInvitationCanceled", () => {
          console.log("RemoteInvitationCanceled: ");
          this.incomingCallNotification = "Call has been cancelled";
          this.callAlertData = this.incomingCallNotification;
          this.incomingCall = false;
          setTimeout(() => {
            this.incomingCall = false;
            this.showDialog = false;
          }, 3000);
        });
        data.on("RemoteInvitationAccepted", (data) => {
          console.log("REMOTE INVITATION ACCEPTED: ", data);
        });
        data.on("RemoteInvitationRefused", (data) => {
          console.log("REMOTE INVITATION REFUSED: ", data);
          this.isCallingUser = false;
          this.showDialog = false;
        });
        data.on("RemoteInvitationFailure", (data) => {
          console.log("REMOTE INVITATION FAILURE: ", data);
          this.isCallingUser = false;
          this.showDialog = false;
        });
      });

      // Subscribes to the online statuses of all users apart from
      // the currently authenticated user
      this.rtmClient.subscribePeersOnlineStatus(
        // console.log(this.users)
        this.videousers
          .map((user) => user.account)
          .filter((user) => user !== this.currentUserId)
      );

      this.rtmClient.on("PeersOnlineStatusChanged", (data) => {
        this.updatedOnlineStatus = data;
        console.log("PeersOnlineStatusChanged", data);
        console.log("sanam", this.updatedOnlineStatus);
      });

      // Create a channel and listen to messages
      this.rtmChannelInstance = this.rtmClient.createChannel(
        this.rtmChannelName
      );

      // Join the RTM Channel
      this.rtmChannelInstance.join();

      this.rtmChannelInstance.on("ChannelMessage", (message, memberId) => {
        console.log("ChannelMessage");
        console.log("message: ", message);
        console.log("memberId: ", memberId);
      });

      this.rtmChannelInstance.on("MemberJoined", (memberId) => {
        console.log("MemberJoined");

        // check whether user exists before you add them to the online user list
        const joiningUserIndex = this.onlineUsers.findIndex(
          (member) => member === memberId
        );
        if (joiningUserIndex < 0) {
          this.onlineUsers.push(memberId);
        }
      });

      this.rtmChannelInstance.on("MemberLeft", (memberId) => {
        console.log("MemberLeft");

        console.log("memberId: ", memberId);
        const leavingUserIndex = this.onlineUsers.findIndex(
          (member) => member === memberId
        );
        this.onlineUsers.splice(leavingUserIndex, 1);
      });

      this.rtmChannelInstance.on("MemberCountUpdated", (data) => {
        console.log(data);
        console.log("MemberCountUpdated");
        // console.log(this);
      });
    },
    async placeCall(calleeName) {
      console.log("making call");
      // Get the online status of the user.
      // For our use case, if the user is not online we cannot place a call.
      // We send a notification to the caller accordingly.
      this.isCallingUser = true;

      this.callingUserNotification = `Calling ${calleeName}...`;
      // alert(this.callingUserNotification)
      this.callAlertData = this.callingUserNotification;
      const onlineStatus = await this.rtmClient.queryPeersOnlineStatus([
        calleeName,
      ]);

      if (!onlineStatus[calleeName]) {
        setTimeout(() => {
          this.callingUserNotification = `${calleeName} could not be reached`;
          this.callAlertData = this.callingUserNotification;
          this.isCallingUser = false;

          setTimeout(() => {
            this.isCallingUser = false;
            this.showDialog = false;
          }, 3000);
        }, 5000);
      } else {
        // Create a channel/room name for the video call
        const videoChannelName = `${this.currentUserId}_${calleeName}`;
        // Create LocalInvitation
        this.localInvitation = this.rtmClient.createLocalInvitation(calleeName);

        this.localInvitation.on(
          "LocalInvitationAccepted",
          async (invitationData) => {
            console.log("LOCAL INVITATION ACCEPTED: ", invitationData);

            // Generate an RTC token using the channel/room name
            const { data } = await this.generateToken(
              videoChannelName,
              this.currentUserId
            );
            console.log(data);
            // Initialize the agora RTC Client
            this.initializeRTCClient();
            // Join a room using the channel name. The callee will also join the room then accept the call
            await this.joinRoom(
              this.AGORA_APP_ID,
              data.token,
              videoChannelName
            ).then((res) => {
              console.log("room joined", res);
            });
            this.isCallingUser = false;
            this.callingUserNotification = "";
          }
        );

        this.localInvitation.on("LocalInvitationCanceled", (data) => {
          console.log("LOCAL INVITATION CANCELED: ", data);
          this.callingUserNotification = `${calleeName} cancelled the call`;
          this.callAlertData = "you cancled the call";

          setTimeout(() => {
            this.isCallingUser = false;
            this.showDialog = false;
          }, 2000);
        });
        this.localInvitation.on("LocalInvitationRefused", (data) => {
          console.log("LOCAL INVITATION REFUSED: ", data);
          this.isCallingUser = false;
          this.callingUserNotification = `${calleeName} refused the call`;
          this.callAlertData = this.callingUserNotification;

          setTimeout(() => {
            this.isCallingUser = false;
            this.showDialog = false;
          }, 2000);
        });

        this.localInvitation.on("LocalInvitationReceivedByPeer", (data) => {
          console.log("LOCAL INVITATION RECEIVED BY PEER: ", data);
        });

        this.localInvitation.on("LocalInvitationFailure", (data) => {
          console.log("LOCAL INVITATION FAILURE: ", data);
          this.callingUserNotification = "Call failed. Try Again";
          this.callAlertData = this.callingUserNotification;
        });

        // set the channelId
        this.localInvitation.channelId = videoChannelName;

        // Send call invitation
        this.localInvitation.send();
      }
    },
    async cancelCall() {
      await this.localInvitation.cancel();
      this.isCallingUser = false;
    },
    async acceptCall() {
      // Generate RTC token using the channelId of the caller
      const { data } = await this.generateToken(
        this.remoteInvitation.channelId,
        this.currentUserId
      );

      // Initialize AgoraRTC Client
      this.initializeRTCClient();

      // Join the room created by the caller
      await this.joinRoom(
        this.AGORA_APP_ID,
        data.token,
        this.remoteInvitation.channelId
      );

      // Accept Call Invitation
      this.remoteInvitation.accept();
      this.incomingCall = false;
      this.callPlaced = true;
      this.callAlertData = "on call";
    },
    initializeRTCClient() {
      this.rtcClient = markRaw(
        AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
      );
    },
    async joinRoom(appID, token, channel) {
      try {
        await this.rtcClient.join(appID, channel, token, this.currentUserId);
        this.callPlaced = true;
        this.createLocalStream();
        this.initializeRTCListeners();
      } catch (error) {
        console.log(error);
      }
    },
    initializeRTCListeners() {
      //   Register event listeners
      this.rtcClient.on("user-published", async (user, mediaType) => {
        console.log("user ");
        await this.rtcClient.subscribe(user, mediaType).then((res, err) => {
          console.log(res, err);
        });
        this.callAlertData = "on call";

        // If the remote user publishes a video track.
        if (mediaType === "video") {
          // Get the RemoteVideoTrack object in the AgoraRTCRemoteUser object.
          this.remoteVideoTrack = user.videoTrack;
          this.remoteVideoTrack.play("remote-video");
        }
        // If the remote user publishes an audio track.
        if (mediaType === "audio") {
          // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.term
          this.remoteAudioTrack = user.audioTrack;
          // Play the remote audio track. No need to pass any DOM element.
          this.remoteAudioTrack.play();
        }
      });

      this.rtcClient.on("user-unpublished", async (data) => {
        console.log("USER UNPUBLISHED: ", data);
        await this.endCall();
      });
    },
    declineCall() {
      this.remoteInvitation.refuse();
      this.incomingCall = false;
      this.showDialog = false;
    },
    async createLocalStream() {
      const [microphoneTrack, cameraTrack] =
        await AgoraRTC.createMicrophoneAndCameraTracks();
      await this.rtcClient.publish([microphoneTrack, cameraTrack]);
      cameraTrack.play("local-video");
      this.localAudioTrack = microphoneTrack;
      this.localVideoTrack = cameraTrack;
    },

    async endCall() {
      this.localAudioTrack.close();
      this.localVideoTrack.close();
      this.localAudioTrack.removeAllListeners();
      this.localVideoTrack.removeAllListeners();
      await this.rtcClient.unpublish();
      await this.rtcClient.leave();
      this.mutedAudio=false
      this.mutedVideo=false
      this.callPlaced = false;
      this.showDialog = false;
    },
    async handleAudioToggle() {
      if (this.mutedAudio) {
        await this.localAudioTrack.setMuted(!this.mutedAudio);
        this.mutedAudio = false;
      } else {
        await this.localAudioTrack.setMuted(!this.mutedAudio);
        this.mutedAudio = true;
      }
    },
    async generateToken(channelName, uid) {
      return await axios.get(
        `https://agora-rtm-rtc-tokens.onrender.com/tokens?channelName=${channelName}&uid=${uid}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
    async handleVideoToggle() {
      if (this.mutedVideo) {
        await this.localVideoTrack.setMuted(!this.mutedVideo);
        this.mutedVideo = false;
      } else {
        await this.localVideoTrack.setMuted(!this.mutedVideo);
        this.mutedVideo = true;
      }
    },
  },
};
</script>
<style >
.auto {
  margin: 0;
}
#video-container {
  width: 700px;
  height: 500px;
  max-width: 90vw;
  max-height: 50vh;
  margin: 0 auto;
  border: 1px solid #099dfd;
  position: relative;
  box-shadow: 1px 1px 11px #9e9e9e;
  background-color: #fff;
}

#local-video {
  width: 30%;
  height: 30%;
  position: absolute;
  left: 10px;
  bottom: 10px;
  border: 1px solid #fff;
  border-radius: 6px;
  z-index: 2;
  cursor: pointer;
}

#remote-video {
  
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 1;
  margin: 0;
  padding: 0;
  cursor: pointer;
}

.action-btns {
  position: absolute;
  bottom: 20px;
  left: 50%;
  margin-left: -50px;
  z-index: 3;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

#btnGroup {
  flex-wrap: wrap;
}
.bgimg {
    background-image: url('../assets/logo.png');
}
</style>
