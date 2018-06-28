let express = require("express");
let graphqlHTTP = require("express-graphql");
let { buildSchema } = require("graphql");
let cors = require("cors");

let schema = buildSchema(`
    type User {
        id : String!
        nickname : String!
        avatar : String!
    }
    type Post {
        id: String!
        user: String!
        caption: String!
        image: String!
    }
    type Query{
        user(id: String) : User!
        post(user_id: String, post_id: String) : Post!
        posts(user_id: String) : [Post]
    }
`);

//Maps id to User object

let userlist = {
    a : {
        id: 'a',
        nickname: 'Zo',
        avatar: 'https://i.imgur.com/r1itaw6.png'
    },
    b: {
        id: 'b',
        nickname: 'TenderLovin',
        avatar: 'https://i.imgur.com/gvrjlV8.png'
    }
};

let postlist = {
    a: {
        a: {
            id: 'a',
            user: userlist['a'],
            caption: 'Im in Japan',
            image: 'https://dynaimage.cdn.cnn.com/cnn/q_auto,w_720,c_fill,g_auto,h_405,ar_16:9/http%3A%2F%2Fcdn.cnn.com%2Fcnnnext%2Fdam%2Fassets%2F170606121226-japan---travel-destination---shutterstock-230107657.jpg'
        },
        b: {
            id: 'b',
            user: userlist['a'],
            caption: "I love Fortnite",
            image: 'https://www.androidcentral.com/sites/androidcentral.com/files/styles/large/public/article_images/2018/03/fortnite-hero%20-%20edited.jpg?itok=aTvkXCvI'
        },
        c: {
            id: 'c',
            user: userlist['a'],
            caption: 'LAbron',
            image: 'https://i0.wp.com/basketballforever.com/wp-content/uploads/2017/12/lbj-lakers-crop.png?resize=660%2C400&ssl=1'
        }
    }
};
//The root provides a resolver fucntion for each API endpoint

let root = {
    user: function({id}) {
        return userlist[id];
    },
    post: function({user_id, post_id}) {
        return postlist[user_id][post_id];
    },
    posts: function({user_id}) {
        return Object.values(postlist[user_id]);
    }
};

let app = express();
app.use(cors());
app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true
    })
);
//set application port

app.listen(4000);
