const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const fs = require("fs");
const { writeFile } = require("fs/promises");
const util = require("util");
const idUnsendGroup = "120363193597511741@g.us";
const antiDelete = async (sock, m, v) => {
  const senderNumber = m.sender.split("@")[0];
  const botNumber = sock.user.id.split(":")[0];
  if (senderNumber == botNumber) return;
  global.onDelete[senderNumber] = global.onDelete[senderNumber]
    ? global.onDelete[senderNumber]
    : [];
  global.unsend_img[senderNumber] = global.unsend_img[senderNumber]
    ? global.unsend_img[senderNumber]
    : [];
  global.unsend_vid[senderNumber] = global.unsend_vid[senderNumber]
    ? global.unsend_vid[senderNumber]
    : [];
  global.unsend_aud[senderNumber] = global.unsend_aud[senderNumber]
    ? global.unsend_aud[senderNumber]
    : [];
  // console.log(v,"INI MESSAGE REVOKE")
  if (global.onDelete[senderNumber]) {
    if (m.type == "protocolMessage") {
      if (m.msg.type == 0) {
        let uns_id = m.msg.key.id;
        for (let umsg of global.onDelete[senderNumber]) {
          let Sumsg = umsg.split("∬∬∬");
          if (Sumsg[0] == uns_id) {
            switch (Sumsg[2]) {
              case "text":
                let t = `..::REVOKED MESSAGE::..
Type : Text
Number : @${senderNumber}
Message : ${Sumsg[1]}`.trim();
                await sock.sendMessage(idUnsendGroup, {
                  text: t,
                  mentions: sock.parseMention(t),
                });
                // Remove from global.Ondelete
                global.onDelete[senderNumber].splice(
                  global.onDelete[senderNumber].indexOf(umsg),
                  1
                );
                break;
              case "img":
                let textImage = `..::REVOKED MESSAGE::..
Type : Image
Number : @${senderNumber}
Message : ${Sumsg[1]}`.trim();
                await sock.sendMessage(idUnsendGroup, {
                  text: textImage,
                  mentions: sock.parseMention(textImage),
                });
                // Remove from global.Ondelete
                await sock.sendMessage(idUnsendGroup, {
                  image: fs.readFileSync(`./backup/img/${uns_id}.jpeg`),
                  caption: Sumsg[1] ?? "",
                });
                global.onDelete[senderNumber].splice(
                  global.onDelete[senderNumber].indexOf(umsg),
                  1
                );

                break;
              case "vid":
                let textVideo = `..::REVOKED MESSAGE::..
Type : Video
Number : @${senderNumber}
Message : ${Sumsg[1]}`.trim();
                await sock.sendMessage(idUnsendGroup, {
                  text: textVideo,
                  mentions: sock.parseMention(textVideo),
                });
                // Remove from global.Ondelete
                await sock.sendMessage(idUnsendGroup, {
                  video: fs.readFileSync(`./backup/vid/${uns_id}.mp4`),
                  caption: Sumsg[1] ?? "",
                });
                global.onDelete[senderNumber].splice(
                  global.onDelete[senderNumber].indexOf(umsg),
                  1
                );
                break;
              case "aud":
                let textAudio = `..::REVOKED MESSAGE::..
Type : Audio
Number : @${senderNumber}`.trim();
                await sock.sendMessage(idUnsendGroup, {
                  text: textAudio,
                  mentions: sock.parseMention(textAudio),
                });
                // Remove from global.Ondelete
                await sock.sendMessage(idUnsendGroup, {
                  audio: fs.readFileSync(`./backup/aud/${uns_id}.mp3`),
                  caption: Sumsg[1] ?? "",
                });
                global.onDelete[senderNumber].splice(
                  global.onDelete[senderNumber].indexOf(umsg),
                  1
                );
                break;
              default:
                break;
            }
          }
        }
      }
    }
  }

  const isMedia = m.type === "imageMessage" || m.type === "videoMessage";
  const isQuotedMsg = m.quoted ? m.quoted.type === "conversation" : false;
  const isQuotedImage = m.quoted ? m.quoted.type === "imageMessage" : false;
  const isQuotedVideo = m.quoted ? m.quoted.type === "videoMessage" : false;
  const isQuotedSticker = m.quoted ? m.quoted.type === "stickerMessage" : false;
  const isQuotedAudio = m.quoted ? m.quoted.type === "audioMessage" : false;
  switch (v.type) {
    case "imageMessage":
      const buffer = await downloadMediaMessage(
        m,
        "buffer",
        {},
        {
          logger: sock.logger,
          // pass this so that baileys can request a reupload of media
          // that has been deleted
          reuploadRequest: sock.updateMediaMessage,
        }
      );
      // save to file
      await writeFile(`./backup/img/${m.key.id}.jpeg`, buffer);
      global.unsend_img[senderNumber][m.key.id] = v.message;
      global.onDelete[senderNumber].push(`${m.key.id}∬∬∬${m.body}∬∬∬img`);
      break;
    case "videoMessage":
      const buffer2 = await downloadMediaMessage(
        m,
        "buffer",
        {},
        {
          logger: sock.logger,
          // pass this so that baileys can request a reupload of media
          // that has been deleted
          reuploadRequest: sock.updateMediaMessage,
        }
      );
      // save to file
      await writeFile(`./backup/vid/${m.key.id}.mp4`, buffer2);
      global.unsend_vid[senderNumber][m.key.id] = v.message;
      global.onDelete[senderNumber].push(`${m.key.id}∬∬∬${m.body}∬∬∬vid`);
      break;
    case "audioMessage":
      const buffer3 = await downloadMediaMessage(
        m,
        "buffer",
        {},
        {
          logger: sock.logger,
          // pass this so that baileys can request a reupload of media
          // that has been deleted
          reuploadRequest: sock.updateMediaMessage,
        }
      );
      // save to file
      await writeFile(`./backup/aud/${m.key.id}.mp3`, buffer3);
      global.unsend_aud[senderNumber][m.key.id] = v.message;
      global.onDelete[senderNumber].push(`${m.key.id}∬∬∬${m.body}∬∬∬aud`);
      break;
    case "messageContextInfo":
      if (v.message.hasOwnProperty("viewOnceMessageV2")) {
        switch (Object.entries(v.message.viewOnceMessageV2?.message)[0][0]) {
          case "imageMessage":
            const buffer = await downloadMediaMessage(
              m,
              "buffer",
              {},
              {
                logger: sock.logger,
                // pass this so that baileys can request a reupload of media
                // that has been deleted
                reuploadRequest: sock.updateMediaMessage,
              }
            );
            // save to file
            await writeFile(`./backup/img/${m.key.id}.jpeg`, buffer);
            global.unsend_img[senderNumber][m.key.id] = v.message;
            global.onDelete[senderNumber].push(`${m.key.id}∬∬∬${m.body}∬∬∬img`);
            break;
          case "videoMessage":
            const buffer2 = await downloadMediaMessage(
              m,
              "buffer",
              {},
              {
                logger: sock.logger,
                // pass this so that baileys can request a reupload of media
                // that has been deleted
                reuploadRequest: sock.updateMediaMessage,
              }
            );
            // save to file
            await writeFile(`./backup/vid/${m.key.id}.mp4`, buffer2);
            global.unsend_vid[senderNumber][m.key.id] = v.message;
            global.onDelete[senderNumber].push(`${m.key.id}∬∬∬${m.body}∬∬∬vid`);
            break;
          case "audioMessage":
            const buffer3 = await downloadMediaMessage(
              m,
              "buffer",
              {},
              {
                logger: sock.logger,
                // pass this so that baileys can request a reupload of media
                // that has been deleted
                reuploadRequest: sock.updateMediaMessage,
              }
            );
            // save to file
            await writeFile(`./backup/aud/${m.key.id}.mp3`, buffer3);
            global.unsend_aud[senderNumber][m.key.id] = v.message;
            global.onDelete[senderNumber].push(`${m.key.id}∬∬∬${m.body}∬∬∬aud`);
            break;
          default:
            break;
        }
      }
    default:
      global.onDelete[senderNumber].push(`${m.key.id}∬∬∬${m.body}∬∬∬text`);
      break;
  }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(`Update ${__filename}`);
  delete require.cache[file];
  require(file);
});

module.exports = antiDelete;
