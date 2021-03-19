var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require("body-parser")
var path = require("path")
var Schema = mongoose.Schema;

var app = express();

var userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    uName: String,
    uNickname: String,
    uID: String,
    uDiscrim: String,
    gBelongsName: String,
    gBelongsID: String,
    uRolesName: Array,
    uRolesID: Array,
    joinedAt: String,
    joinedAtTimestamp: String,
    isBot: Boolean,
    isMuted: Boolean,
    mutedFor: Number,
    messagesSent: { type: Number, default: 0 },
    xpEarned: { type: Number, default: 0 },
    level: {type: Number, default: 0},
    canXp: { type: Boolean, default: true}
}, {
    collection: 'registerusers'
});

var guildSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildName: String,
    guildID: String,
    channelNames: Array,
    ChannelIDs: Array,
    loggingID: String,
    autoRoleID: String,
    welcomeMessage: String,
    welcomeBackMessage: String,
    leaveMessage: String,
    Leveling: {type: Boolean, default: true},
    vc: {type: Boolean, default: true},
    delete: {type: Boolean, default: true},
    mock: {type: Boolean, default: true},
    nick: {type: Boolean, default: true},
    ping: {type: Boolean, default: true},
    say: {type: Boolean, default: true},
    uptime: {type: Boolean, default: true},
    ban: {type: Boolean, default: true},
    kick: {type: Boolean, default: true},
    purge: {type: Boolean, default: true},
    givexp: {type: Boolean, default: true},
    removexp: {type: Boolean, default: true},
    resetxp: {type: Boolean, default: true},
    mute: {type: Boolean, default: true},
    unmute: {type: Boolean, default: true},
    muted: {type: Boolean, default: true},
    lock: {type: Boolean, default: true},
    unlock: {type: Boolean, default: true},
    botinfo: {type: Boolean, default: true},
    invite: {type: Boolean, default: true},
    leaderboard: {type: Boolean, default: true},
    level: {type: Boolean, default: true},
    unban: {type: Boolean, default: true}
}, {
    collection: 'registerguilds'
})

mongoose.connect('mongodb+srv://NotNalyd:Nalyd13692016!@cluster0.ftyko.mongodb.net/discordbotjs?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var UserM = mongoose.model('UserModel', userSchema);
var guildM = mongoose.model('GuildModel', guildSchema);

app.set("view engine", "ejs")
app.set("views", "./views/")
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.urlencoded({extended: false}))

app.get('/home', (req, res) => {
    UserM.countDocuments({
    }, function(err, userResult) {
        if (err) throw err;

        if (!userResult) {
            res.send(JSON.stringify({
                error : "Error"
            }))
        }

        guildM.countDocuments({
        }, function(err, guildResult) {
            if (err) throw err;
            if (guildResult) {
                res.render("index", {userCount: userResult, guildCount: guildResult})
            } else {
                res.send(JSON.stringify({
                    error : "Error"
                }))
            }
        })
    })
})

app.get('/guild/:id', (req, res) => {
    guildM.findOne({
        guildID: req.params.id
    }, function(err, guildResult) {
        if (err) throw err;
        if (guildResult) {
            res.render("guild", {data: guildResult.guildName,
            welcomeMessage: guildResult.welcomeMessage,
            welcomeBackMessage: guildResult.welcomeBackMessage,
            goodbyeMessage: guildResult.leaveMessage})
        } else {
            res.send(JSON.stringify({
                error : "Error"
            }))
        }
    })
})

app.get('/leaderboard/:id', (req, res) => {
    var leaderboardPos = []
    var dataName = []
    var dataLevel = []
    var dataXP = []
    var placement = 1


    UserM.find({gBelongsID: req.params.id, isBot: false, xpEarned: { $gt: 0 }}, (err, users) => { 
        if (err) { 
            console.log(err); 
        } else { 
            for (result of users) {
                leaderboardPos.push(`${placement}`)
                dataName.push(`${result.uName}`)
                dataLevel.push(`${result.level}`)
                dataXP.push(`${result.xpEarned}`)
                placement += 1
            }
            if (leaderboardPos) {
                res.render("leaderboard", {leaderboardPos: leaderboardPos,
                    dataName: dataName,
                    dataLevel: dataLevel,
                    dataXP: dataXP
                })
            } else {
                res.send(JSON.stringify({
                    error : "Error"
                }))
                console.log("error")
            }
        } 
    }).sort({ xpEarned: -1 });
})

var port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log('Node.js listening on port ' + port);
});