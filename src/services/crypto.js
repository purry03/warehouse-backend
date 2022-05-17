const config = require("../config");
const crypto = require("crypto");

const encrypt = (value) => {

    const key = config.SECRET;
    var cipher = crypto.createCipher("aes256", key);
    var encrypted = cipher.update(value, "utf8", "hex");
    encrypted += cipher.final("hex");

    return encrypted

}

const decrypt = (encrypted) => {
    const key = config.SECRET;
    var decipher = crypto.createDecipher("aes256", key);
    var decrypted = decipher.update(encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")
    return decrypted
}

module.exports = { encrypt, decrypt }