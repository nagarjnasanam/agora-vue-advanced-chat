import AC from "agora-chat";
import axios from 'axios'
const conn = new AC.connection({
    appKey: process.env.VUE_APP_KEY,
    delivery: true
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
    logout() {
        conn.close()
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
    async retrieveIndividualChat(uid) {
        var options = {
            // The ID of the peer user, or chat group, or chat room, depending on the chat type.
            targetId: uid,
            // (Optional) The number of messages that you expect to get on each page. The value range is [1,50] and the default value is 20.
            pageSize: 20,
            // (Optional) The starting message ID for query. If the parameter is set as -1, an empty string, or null, the SDK retrieves messages from the latest one.
            cursor: -1,
            // (Optional) The conversation type. (Default) singleChat: one-to-one conversation; groupChat: group conversation; chatRoom: chat room conversation.
            chatType: "singleChat",
            // The message search direction.
            // (Default) up: Messages are retrieved in the reverse chronological order of when the server receives them;
            // down: Messages are retrieved in the chronological order of when the server receives them.
            searchDirection: "down",
        };
        const data = await conn
            ?.getHistoryMessages(options)
        console.log(data)
        return data

    },
    async sendMessage(uid, message,) {
        this.handleLogin()
        const option = {
            chatType: "singleChat",
            type: "txt",
            to: uid,
            msg: message,
        };
        const msg = AC.message.create(option);

        const sendMessage = await conn.send(msg)

        return sendMessage

    },
    formattedFiles(file) {
        const formattedFiles = []

        // files.forEach(file => {
        const messageFile = {
            name: file.name,
            size: file.size,
            type: file.type,
            extension: file.extension || file.type,
            url: file.url || file.localUrl
        }

        if (file.audio) {
            messageFile.audio = true
            messageFile.duration = file.duration
        }

        formattedFiles.push(messageFile)
        // })

        return formattedFiles
    },
    formatAgoraFiles(file) {
        console.log(file)
        const formattedFiles = []

        // files.forEach(file => {
        const messageFile = {
            file_name: file?.ext?.file_name,
            file_size: file?.ext?.file_size,
            file_type: file.type,
            extension: file?.ext?.file_type,
            url: file.url || file.localUrl
        }

        if (file.audio) {
            messageFile.audio = true
            messageFile.duration = file?.ext?.file_duration
        }

        formattedFiles.push(messageFile)
        // })

        return formattedFiles
    },

    async sendImage(uid, file) {
        console.log(uid)
        var data;

        // await files.forEach(
        // file => {
        console.log(file)
        var allowType = {
            jpg: true,
            gif: true,
            png: true,
            bmp: true,
        };
        if (file.extension.toLowerCase() in allowType) {
            var option = {
                // Set the message type.
                type: "img",
                file: file,
                ext: {
                    // Set the image file length.
                    file_size: file.size,
                    file_type: file.extension,
                    file_name: file.name,



                },
                // Set the username of the message receiver.
                to: uid,
                // Set the chat type.
                chatType: "singleChat",
                // Occurs when the image file fails to be uploaded.
                onFileUploadError: function () {
                    // console.log("onFileUploadError");
                },
                // Reports the progress of uploading the image file.
                onFileUploadProgress: function () {
                    // console.log(e);
                },
                // Occurs when the image file is successfully uploaded.
                onFileUploadComplete: function () {
                    // console.log("onFileUploadComplete");
                },
            };

            var msg = AC.message.create(option);
            data = await conn.send(msg)

        }
        return data


        // }


    },
    async sendAudio(uid, file) {
        var data
        // await files.forEach(async file => {
        if (file.audio) {
            var allowType = {
                mp3: true,
                amr: true,
                wmv: true,
            };
            let stringToRemove = "audio/";

            let fileType = file.type.replace(stringToRemove, "");
            console.log(fileType);
            if (fileType.toLowerCase() in allowType) {
                var option = {
                    // Set the message type
                    type: "audio",
                    file: file,
                    // Set the length of the audio file in seconds.
                    length: "3",
                    // Set the username of the message receiver.
                    to: uid,
                    // Set the chat type.
                    chatType: "singleChat",
                    // Occurs when the audio file fails to be uploaded.
                    onFileUploadError: function () {
                        console.log("onFileUploadError");
                    },
                    // Reports the progress of uploading the audio file.
                    onFileUploadProgress: function (e) {
                        console.log(e);
                    },
                    // Occurs when the audio file is successfully uploaded.
                    onFileUploadComplete: function () {
                        console.log("onFileUploadComplete");
                    },
                    ext: {
                        file_type: fileType,
                        file_name: file.name,
                        file_duration: file.duration,
                        file_size: file.size,
                    },
                };
                // Create a voice message.
                var msg = AC.message.create(option);

                // Call send to send the voice message.
                data = await conn.send(msg)

            }

        }
        // })

        return data




    },
    async fetchUsers() {
        var data;

        try {
            await axios.get(
                "https://a41.chat.agora.io/41975973/1139922/users",
                {
                    headers: {
                        Authorization: `Bearer ${appToken}`,
                        "Content-Type": "application/json",
                    },
                }
            ).then(res => {
                console.log(res)
                data = res
                return res
            })

        } catch (error) {
            data = error
            console.log(error)

        }
        return data
    },
    async deleteChat(uid) {
        let options = {
            // conversation ID: The conversation ID is the user ID of the peer user for one-to-one chat and the group ID for group chat.
            channel: uid,
            // Conversation type: (Default) `singleChat`: one-to-one chat; `groupChat`: group chat.
            chatType: "singleChat",
            // Whether to delete historical messages from the server with the conversation.
            deleteRoam: true,
        };
        console.log(conn.deleteConversation(options))
        return await conn.deleteConversation(options)

    },
    deleteMessage(uid, messageId) {
        console.log(uid, messageId)
        console.log(messageId.content)
        let option = {
            mid: messageId,
            to: uid,
            chatType: "singleChat",
        };
        return conn.recallMessage(option)

    },
    async getUserStatus(username) {
        // /{org_name}/{app_name}/users/{username}/status
        // const data =  await
        var status;
        await axios
            .get(
                `https://a41.chat.agora.io/41975973/1139922/users/${username}/status`,
                {
                    headers: {
                        Authorization: `Bearer ${appToken}`,
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((res) => {
                console.log(res?.data?.data[username])
                status = res?.data?.data[username]

            });
        return status
    }

}