const avatarObj = {
    avatars: [{
        name: "av0",
        path: require("./av1.jpg")
    },
    ],
    addAvatar: function (source) {
        let temp = this.avatars.length
        try {
            this.avatars.push(
                {
                    name: "av" + temp,
                    path: require("./" + source + '.jpg')
                }
            )
        }
        catch {
            return console.log("invalid path")
        }
        return;
    },
};
avatarObj.addAvatar("av2");
avatarObj.addAvatar("av3");
avatarObj.addAvatar("av4");
avatarObj.addAvatar("av5");
avatarObj.addAvatar("av6");
avatarObj.addAvatar("av7");
avatarObj.addAvatar("av7");
avatarObj.addAvatar("av7");
avatarObj.addAvatar("av7");
export { avatarObj };