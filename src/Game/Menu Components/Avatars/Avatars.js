const avatarObj = {
    avatars: [{
        id: 0,
        path: require("./av0.jpg")
    },
    ],
    addAvatar: function (source) {
        let temp = this.avatars.length
        try {
            this.avatars.push(
                {
                    id: temp,
                    path: require("./" + source + '.jpg')
                }
            )
        }
        catch {
            return console.log("invalid path")
        }
        return;
    },
    default: {
        path: require("./placeholder.jpg")
    }
};
avatarObj.addAvatar("av1");
avatarObj.addAvatar("av2");
avatarObj.addAvatar("av3");
avatarObj.addAvatar("av4");
avatarObj.addAvatar("av5");
avatarObj.addAvatar("av6");



export { avatarObj };