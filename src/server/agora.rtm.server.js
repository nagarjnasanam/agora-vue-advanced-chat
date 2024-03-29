import axios from "axios";
import AgoraRTM from "agora-rtm-sdk";
import AgoraRTC from "agora-rtc-sdk-ng";
export default {
    async fetchUsers() {
        const data = await axios.get("https://agora-rtm-rtc-tokens.onrender.com/users", {
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (data.data.users) {
          console.log(data);
          this.users = data.data.users;
        }
      },
}