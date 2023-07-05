import AC from "agora-chat";
import axios from 'axios'
const conn = new AC.connection({
    appKey: process.env.VUE_APP_KEY,
});
const appToken = localStorage.getItem("AgoraAPPToken");
export default {
    async handleLogin() {
        var id = localStorage.getItem("AgoraUserId");
        var tkn = localStorage.getItem("AgoraToken");
        await conn
            .open({
                user: id,
                agoraToken: tkn,
            })
            .then((res) => {
                // localStorage.setItem("agoraUserId", this.currentUserId);
                // localStorage.setItem("agoraToken", this.token);
                console.log(res);
            });
    },
    agoraConnection() {
        return conn
    },
    async getGroupList(userId) {
        console.log("grouppppp")
        try {
            // https://a41.chat.agora.io/41975973/1139922/users/arjun/joined_chatgroups
            // let token = localStorage.getItem("agoraToken");
            // var appToken = "007eJxTYGBXiFn6autCn66UUAE/6RdLC4I7GGstP5jGu+sK3Itey6zAYJaWaGxubGmRaJqUamKZYmhhnpJknmySZmBmkGJhamywpq0zpSGQkaGgzJuRkYGVgREIQXwVhsTEVOO01DQDXQNLA0NdQ8PUVF1L09Q0XYOUFOM0S2NTMyMzIwBOjSSP"

            axios.get(
                `https://a41.chat.agora.io/41975973/1139922/users/${userId}/joined_chatgroups`,
                {
                    headers: {
                        Authorization: `Bearer ${appToken}`,
                        "Content-Type": "application/json",
                    },
                }
            )
                .then((res) => {
                    console.log(res)

                    return res;
                })
            //   let userId = localStorage.getItem("agoraUserId");
            //   let token = "007eJxTYIhZ8Irt7K3be/RvMZiKlOrv0qj5LyW9siriRMgR+zVHXzQpMCQlJpmkGpqaGiQZm5uYJ6ZYWFoYm1hYWKRaGKYZmlsa/kyOSWkIZGRIiLvNwMjACsSMDCC+CoNxoomZUaqlgW6qqaWhrqFhaoquZapZim6ieapRappBomWaYSoAmwsoCQ=="

        } catch (error) {
            console.log("r", error)
            return error;
        }
    },
    // async listUserGroups() {
    //     const res = await (this.currentUserId);
    //     return res;
    // },
    async fetchRooms(uid) {
        const pullUserName = /_(.*?)@/;
        const res = await conn.getConversationlist({ pageNum: 1, pageSize: 20 });
        const userList = res?.data?.channel_infos?.reduce((acc, chat) => {
            const userName = pullUserName.exec(chat.channel_id)[1];
            return userName ? [...acc, userName] : acc;
        }, []);
        const groupNames = await this.getGroupList(uid);
        const groupList = groupNames?.data?.data.map((data) => {
            return data.groupname;
        });

        console.log(res);
        return {
            users: userList, groupNames: groupList
        }

    },
}