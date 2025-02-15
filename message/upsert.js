require("../config");

const fs = require("fs");
const util = require("util");

const { Json, removeAccents } = require("../lib/functions");
const { client, sms } = require("../lib/simple");
const antiDelete = require("../lib/antidelete");

module.exports = async (sock, m, store) => {
  try {
    sock = client(sock);
    v = await sms(sock, m);
    const prefix = global.prefix;
    const isCmd = m.body.startsWith(prefix);
    const command = isCmd
      ? removeAccents(m.body.slice(prefix.length))
          .trim()
          .split(" ")
          .shift()
          .toLowerCase()
      : "";

    const args = m.body.trim().split(/ +/).slice(1);
    const q = args.join(" ");
    const senderNumber = m.sender.split("@")[0];
    const botNumber = sock.user.id.split(":")[0];

	await antiDelete(sock,m,v)

    const groupMetadata = m.isGroup ? await sock.groupMetadata(v.chat) : {};
    const groupMembers = m.isGroup ? groupMetadata.participants : [];
    const groupAdmins = m.isGroup ? sock.getGroupAdmins(groupMembers) : false;

    const isMe = botNumber == senderNumber;
    const isBotAdmin = m.isGroup
      ? groupAdmins.includes(botNumber + "@s.whatsapp.net")
      : false;
    const isOwner = owner.includes(senderNumber) || isMe;
    const isStaff = staff.includes(senderNumber) || isOwner;

    const isMedia = m.type === "imageMessage" || m.type === "videoMessage";
    const isQuotedMsg = m.quoted ? m.quoted.type === "conversation" : false;
    const isQuotedImage = m.quoted ? m.quoted.type === "imageMessage" : false;
    const isQuotedVideo = m.quoted ? m.quoted.type === "videoMessage" : false;
    const isQuotedSticker = m.quoted
      ? m.quoted.type === "stickerMessage"
      : false;
    const isQuotedAudio = m.quoted ? m.quoted.type === "audioMessage" : false;
    switch (command) {
      case "test":
        v.reply("test");
        break;
	  case "ping":
		let msgSent = await sock.sendMessage(v.chat,{text:"Ping!!!"});
		console.log(msgSent)
		// console.log(v)
		var goutamload = [
`ㅤʟᴏᴀᴅɪɴɢ
《 █▒▒▒▒▒▒▒▒▒▒▒》10%`,
`ㅤʟᴏᴀᴅɪɴɢ
《 ████▒▒▒▒▒▒▒▒》30%`,
`ㅤʟᴏᴀᴅɪɴɢ
《 ███████▒▒▒▒▒》50%`,
`ㅤʟᴏᴀᴅɪɴɢ
《 ██████████▒▒》80%`,
`ㅤʟᴏᴀᴅɪɴɢ
《 ████████████》100%`,
"ʟᴏᴀᴅɪɴɢ ᴄᴏᴍᴘʟᴇᴛᴇ"
]
		for (let i = 1; i < goutamload.length; i++) {
			await sock.relayMessage(v.chat, {
				protocolMessage: {
					key: msgSent.key,
					type: 14,
					editedMessage: {
					conversation: goutamload[i]
					}
				}
				}, {})
		}
      default:
        if (isOwner) {
          if (v.body.startsWith("x")) {
            try {
              await v.reply(Json(eval(q)));
            } catch (e) {
              await v.reply(String(e));
            }
          }
        }
    }
  } catch (e) {
    console.log(e);
  }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(`Update ${__filename}`);
  delete require.cache[file];
  require(file);
});
