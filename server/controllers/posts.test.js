const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/User");
const Post = require("../models/Post");

describe("API Tests", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    await User.deleteMany();
    await Post.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/posts", () => {
    it("should create a new post", async () => {
      const user = new User({
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        password: "password",
        location: "New York",
        picturePath: "path/to/picture",
      });
      await user.save();

      const response = await request(app)
        .post("/api/posts")
        .send({
          userId: user.id,
          description: "This is a test post",
          picturePath: "path/to/picture",
        })
        .expect(201);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].description).toBe("This is a test post");
      expect(response.body[0].userId).toBe(user.id);
    });
  });

  describe("GET /api/posts", () => {
    it("should return all posts", async () => {
      const user = new User({
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        password: "password",
        location: "New York",
        picturePath: "path/to/picture",
      });
      await user.save();

      const post1 = new Post({
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        description: "This is a test post 1",
        userPicturePath: user.picturePath,
        picturePath: "path/to/picture1",
        likes: {},
        comments: [],
      });
      await post1.save();

      const post2 = new Post({
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        description: "This is a test post 2",
        userPicturePath: user.picturePath,
        picturePath: "path/to/picture2",
        likes: {},
        comments: [],
      });
      await post2.save();

      const response = await request(app).get("/api/posts").expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].description).toBe("This is a test post 1");
      expect(response.body[1].description).toBe("This is a test post 2");
    });
  });

  describe("GET /api/posts/:userId", () => {
    it("should return posts for a specific user", async () => {
      const user1 = new User({
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        password: "password",
        location: "New York",
        picturePath: "path/to/picture",
      });
      await user1.save();

      const user2 = new User({
        firstName: "Jane",
        lastName: "Doe",
        email: "janedoe@example.com",
        password: "password",
        location: "Chicago",
        picturePath: "path/to/picture",
      });
      await user2.save();

      const post1 = new Post({
        userId: user1.id,
        firstName: user1.firstName,
        lastName: user1.lastName,
        location: user1.location,
        description: "This is a test post 1",
        userPicturePath: user1.picturePath,
        picturePath: "path/to/picture1",
        likes: {},
        comments: [],
      });
      await post1.save();

      const post2 = new Post({
        userId: user2.id,
        firstName: user2.firstName,
        lastName: user2.lastName,
        location: user2.location,
        description: "This is a test post 2",
        userPicturePath: user2.picturePath,
        picturePath: "path/to/picture2",
        likes: {},
        comments: [],
      });
      await post2.save();

      const response = await request(app)
        .get(`/api/posts/${user1.id}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].description).toBe("This is a test post 1");
      expect(response.body[0].userId).toBe(user1.id);
    });
  });

  describe("PUT /api/posts/:id/like", () => {
    it("should like a post", async () => {
      const user = new User({
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        password: "password",
        location: "New York",
        picturePath: "path/to/picture",
      });
      await user.save();

      const post = new Post({
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        description: "This is a test post",
        userPicturePath: user.picturePath,
        picturePath: "path/to/picture",
        likes: {},
        comments: [],
      });
      await post.save();

      const response = await request(app)
        .put(`/api/posts/${post.id}/like`)
        .send({
          userId: user.id,
        })
        .expect(200);

      expect(response.body.likes.get(user.id)).toBe(true);
    });
  });
});