<template>
  <div class="about">
    <h3>This is an about page : {{ agora }}</h3>
    <div>
      <input v-model="uid" />
      <button @click="initRtmInstance()">Sign In</button>
    </div>
    <div>
      <div v-for="user in users" :key="user">
        <!-- {{ user.account }} -- {{ updatedOnlineStatus[user.account] }} -->

        <div id="app">
          <div class="container my-5">
            <div class="row">
              <div class="col" v-if="isLoggedIn">
                <div class="btn-group" role="group" id="btnGroup">
                  <button
                    type="button"
                    class="btn btn-primary mr-2 my-2"
                    @click="placeCall(user.account)"
                  >
                    Call {{ user.account }}
                    <span class="badge badge-light">
                      {{ updatedOnlineStatus[user.account] }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
            
          </div>
          
        </div>
      </div>
      <div class="row my-5" v-if="isCallingUser">
              <div class="col-12">
                <p>{{ callingUserNotification }}</p>
                <button
                  type="button"
                  class="btn btn-danger"
                  @click="cancelCall()"
                >
                  Cancel Call
                </button>
              </div>
            </div>
            <!-- Incoming Call  -->
            <div class="row my-5" v-if="incomingCall">
              <div class="col-12">
                <!-- <p>Incoming Call From <strong>${ incomingCaller }</strong></p> -->
                <p>{{ incomingCallNotification }}</p>
                <div class="btn-group" role="group">
                  <button
                    type="button"
                    class="btn btn-danger"
                    data-dismiss="modal"
                    @click="declineCall()"
                  >
                    Decline
                  </button>
                  <button
                    type="button"
                    class="btn btn-success ml-5"
                    @click="acceptCall"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
            <section id="video-container" v-if="callPlaced">
            <div id="local-video" ref="localVideo"></div>
            <div id="remote-video" ref="remoteVideo"></div>

            <div class="action-btns">
              <button
                type="button"
                class="btn btn-info"
                @click="handleAudioToggle()"
              >
                {{ mutedAudio ? "Unmute" : "Mute" }}
              </button>
              <button
                type="button"
                class="btn btn-primary mx-4"
                @click="handleVideoToggle()"
              >
                {{ mutedVideo ? "ShowVideo" : "HideVideo" }}
              </button>
              <button type="button" class="btn btn-danger" @click="endCall()">
                EndCall
              </button>
            </div>
          </section>
            <!-- End of Incoming Call  -->
    </div>
  </div>
</template>
<script>
import axios from "axios";
import AgoraRTM from "agora-rtm-sdk";
import AgoraRTC from "agora-rtc-sdk-ng";
import { markRaw } from "vue";
const rtmClient = null;
console.log(rtmClient);
export default {
  name: "agoraCompo",
  components: {},
  data() {
    return {
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
      users: [],
      updatedOnlineStatus: {},
      rtmChannelName: null,
      isCallingUser: false,
      callingUserNotification: "",
      localAudioTrack: null,
      localVideoTrack: null,
      remoteVideoTrack: null,
      remoteAudioTrack: null,
      uid: "",
    };
  },
  async mounted() {
    this.uid = localStorage.getItem("AgoraUserId");

    console.log(this.rtmClient);
    this.fetchUsers();

    this.initRtmInstance();

    // const client = AgoraRTM.createInstance(this.AGORA_APP_ID);

    // console.log(client);

    // const { data } = await this.generateToken("this.rtmChannelName", this.uid);
    // client
    //   .login({
    //     uid: this.uid,
    //     token: data.rtm_token,
    //   })
    //   .then(() => {
    //     console.log("AgoraRTM client login success");
    //   })
    //   .catch((err) => {
    //     console.log("AgoraRTM client login failure", err);
    //   });
  },
  methods: {
    async fetchUsers() {
      // alert("hello");
      console.log(
        "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1"
      );
      const data = await axios.get("https://agora-rtm-rtc-tokens.onrender.com/users", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log(data);

      if (data.data.users) {
        console.log(data);
        this.users = data.data.users;
      }
    },
    async logoutUser() {
      console.log("destroyed!!!");
      console.log(this.users);
      this.rtmChannelInstance.leave(this.uid);
      await this.rtmClient.logout();
    },
    async initRtmInstance() {
      // initialize an Agora RTM instance
      this.rtmClient = AgoraRTM.createInstance(
        "6fa37398a5be49d187db7c4f060d8530"
      );

      // RTM Channel to be used
      this.rtmChannelName = "videoCallChannel";

      // Generate the RTM token
      const { data } = await this.generateToken(this.rtmChannelName, this.uid);
      console.log(data);

      // Login when it mounts
      await this.rtmClient
        .login({
          uid: this.uid,
          token: data.rtm_token,
        })
        .then(() => {
          console.log("RTM client logged in success ");
          console.log(this.users);
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
        this.remoteInvitation = data;
        this.incomingCall = true;
        this.incomingCaller = data.callerId;
        this.incomingCallNotification = `Incoming Call From ${data.callerId}`;

        data.on("RemoteInvitationCanceled", () => {
          console.log("RemoteInvitationCanceled: ");
          this.incomingCallNotification = "Call has been cancelled";
          setTimeout(() => {
            this.incomingCall = false;
          }, 5000);
        });
        data.on("RemoteInvitationAccepted", (data) => {
          console.log("REMOTE INVITATION ACCEPTED: ", data);
        });
        data.on("RemoteInvitationRefused", (data) => {
          console.log("REMOTE INVITATION REFUSED: ", data);
        });
        data.on("RemoteInvitationFailure", (data) => {
          console.log("REMOTE INVITATION FAILURE: ", data);
        });
      });

      // Subscribes to the online statuses of all users apart from
      // the currently authenticated user
      this.rtmClient.subscribePeersOnlineStatus(
        // console.log(this.users)
        this.users
          .map((user) => user.account)
          .filter((user) => user !== this.uid)
      );

      this.rtmClient.on("PeersOnlineStatusChanged", (data) => {
        this.updatedOnlineStatus = data;
        console.log("PeersOnlineStatusChanged", data);
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
      // Get the online status of the user.
      // For our use case, if the user is not online we cannot place a call.
      // We send a notification to the caller accordingly.
      this.isCallingUser = true;

      this.callingUserNotification = `Calling ${calleeName}...`;
      const onlineStatus = await this.rtmClient.queryPeersOnlineStatus([
        calleeName,
      ]);

      if (!onlineStatus[calleeName]) {
        setTimeout(() => {
          this.callingUserNotification = `${calleeName} could not be reached`;

          setTimeout(() => {
            this.isCallingUser = false;
          }, 5000);
        }, 5000);
      } else {
        // Create a channel/room name for the video call
        const videoChannelName = `${this.uid}_${calleeName}`;
        // Create LocalInvitation
        this.localInvitation = this.rtmClient.createLocalInvitation(calleeName);

        this.localInvitation.on(
          "LocalInvitationAccepted",
          async (invitationData) => {
            console.log("LOCAL INVITATION ACCEPTED: ", invitationData);

            // Generate an RTC token using the channel/room name
            const { data } = await this.generateToken(
              videoChannelName,
              this.uid
            );
            console.log(data);
            // Initialize the agora RTC Client
            this.initializeRTCClient();
            // Join a room using the channel name. The callee will also join the room then accept the call
            await this.joinRoom(
              this.AGORA_APP_ID,
              data.token,
              videoChannelName
            ).then(res=>{
              console.log("room joined",res)
            })
            this.isCallingUser = false;
            this.callingUserNotification = "";
          }
        );

        this.localInvitation.on("LocalInvitationCanceled", (data) => {
          console.log("LOCAL INVITATION CANCELED: ", data);
          this.callingUserNotification = `${calleeName} cancelled the call`;
          setTimeout(() => {
            this.isCallingUser = false;
          }, 5000);
        });
        this.localInvitation.on("LocalInvitationRefused", (data) => {
          console.log("LOCAL INVITATION REFUSED: ", data);
          this.callingUserNotification = `${calleeName} refused the call`;
          setTimeout(() => {
            this.isCallingUser = false;
          }, 5000);
        });

        this.localInvitation.on("LocalInvitationReceivedByPeer", (data) => {
          console.log("LOCAL INVITATION RECEIVED BY PEER: ", data);
        });

        this.localInvitation.on("LocalInvitationFailure", (data) => {
          console.log("LOCAL INVITATION FAILURE: ", data);
          this.callingUserNotification = "Call failed. Try Again";
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
        this.uid
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
    },
    declineCall() {
      this.remoteInvitation.refuse();
      this.incomingCall = false;
    },
    async joinRoom(appID, token, channel) {
      try {
        await this.rtcClient.join(appID, channel, token, this.uid);
        this.callPlaced = true;
        this.createLocalStream();
        this.initializeRTCListeners();
      } catch (error) {
        console.log(error);
      }
    },
    initializeRTCClient() {
      this.rtcClient =markRaw(AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }))
    },
    initializeRTCListeners() {
      //   Register event listeners
      this.rtcClient.on("user-published", async (user, mediaType) => {
        console.log("user ")
        await this.rtcClient.subscribe(user, mediaType).then((res,err)=>{
          console.log(res,err)
        });

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

      this.rtcClient.on("user-unpublished", (data) => {
        console.log("USER UNPUBLISHED: ", data);
        // await this.endCall();
      });
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
      this.callPlaced = false;
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
  width: 100%;
  height: 100%;
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
</style>