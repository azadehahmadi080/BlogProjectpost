import express from "express";
import bodyParser from "body-parser";
import path from "path";
import multer from "multer";

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.set("view engine", "ejs");

// Set storage engine for Multer
const storage = multer.diskStorage({
  destination: "./public/images",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Initialize Multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1 MB limit
}).single("imageUrl");

// Default posts
const defaultPosts = [
  {
    id: 1,
    title: "Toyota",
    description:
      "Yes, we know it's better known as the maker of indestructible runabouts and of the unbreakable Land Cruiser, vehicle of choice for any part of off-road Africa. But over the years, this Japanese (https://www.opumo.com/magazine/best-japanese-car-brands/) mega-company has come up with some nifty sports cars too. The mid-engined MR2 provided budget sports car transport (https://www.opumo.com/magazine/best-cheap-sports-cars/) for 1980s yuppies, while the Celica won multiple World Rally Championships in the 1990s. We’re including today’s Toyota not only for the frankly insane GR Yaris hatchback,but for the menacing style of the GR Supra sports car. There are BMW underpinnings - no bad thing - and just look at that Gotham City style. ",
    imageUrl: "/images/car1.jpg",
  },
  {
    id: 2,
    title: "McLaren ",
    description:
      "Woking’s most famous export has become a serious player in the sports car market in less than 20 years, which is quite the achievement. We’re leaving aside the one-off F1, a landmark in itself, in favour of the vision of former McLaren supremo Ron Dennis who saw that the aura of a multiple title-winning Formula One team could be ramped out to a range of sports cars. Take your pick from a variety of sleek models based around a carbon fibre tub, such as the elegant 765LT, perfect for the Malibu beach house.",
    imageUrl: "/images/car2.jpg",
  },
  {
    id: 3,
    title: "Alfa Romeo",
    description:
      "We couldn’t leave out one of Italy’s greatest marques when it comes to sports cars. You don’t have to look far in Alfa history to find some truly noteworthy beasts: from svelte 1960s convertible Duetto to 2013’s carbon fibre 4C Coupé. Rumours persist of a rebirth of a classic Alfa sports car in the coming year or two, but we’re quite satisfied in the meantime with the epic four-door snarl of the 503 bhp Giulia Quadrifoglio, proud bearer of the four-leaf clover badge that warns of the very fast Alfa that carries it.",
    imageUrl: "/images/car4.jpg",
  },
  {
    id: 4,
    title: "McLaren F1",
    description:
      "It is considered by the automotive press to be the successor to the McLaren F1, utilising hybrid power and Formula One technology, but does not have the same three-seat layout. McLaren later stated that the Speedtail serves as the actual successor to the McLaren F1. The P1 has a mid-engine, rear wheel drive design that used a carbon fibre monocoque and roof structure safety cage concept called MonoCage, which is a development of the MonoCell first used in the MP4-12C and then in subsequent models. Its main competitors are the LaFerrari and the 918 Spyder. They are all similar in specifications and performance, and in a race around Silverstone circuit they were all within half a second of each other, the P1 finishing first at 58.24 seconds and the LaFerrari finishing last at 58.58 seconds; the 918 was in-between with 58.46 seconds.[9] Parts of the car were inspired by a sailfish that Frank Stephenson saw when on holiday in Miami.[10] 58 units of the track-oriented P1 GTR[11] and 5 units of its road legal counterpart, the P1 LM were produced after the initial run of 375 cars. 13 experimental prototypes 'XP', 5 validation prototypes 'VP',[12] and 3 pre-production 'PP' cars were produced by McLaren before the production of the P1 started.[13] A number of these 21 test cars have been refurbished, modified and sold to customers.[14]",
    imageUrl: "/images/car3.jpg",
  },
];

let posts = [...defaultPosts];

app.get("/", (req, res) => {
  const success = req.query.success === "true";
  res.render("index", { posts, success });
});

app.get("/newpost", (req, res) => {
  res.render("newpost");
});

app.post("/newpost", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err);
      // Handle error
    } else {
      const { title, description } = req.body;
      const imageUrl = req.file ? `/images/${req.file.filename}` : null;
      const id = Date.now(); // Generate a unique ID for the post

      const newPost = { id, title, description, imageUrl };
      posts.push(newPost);

      res.redirect("/?success=true");
    }
  });
});

app.get("/edit/:id", (req, res) => {
  const success = req.query.success === "true";
  const postId = parseInt(req.params.id);
  const post = posts.find((post) => post.id === postId);
  res.render("edit", { post, success });
});

app.post("/edit/:id", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err);
      // Handle error
    } else {
      const postId = parseInt(req.params.id);
      const { title, description } = req.body;
      const imageUrl = req.file ? `/images/${req.file.filename}` : null;
      const id = Date.now(); // Generate a unique ID for the post

      const index = posts.findIndex((post) => post.id === postId);
      if (index !== -1) {
        posts[index].title = title;
        posts[index].description = description;
        if (imageUrl) {
          posts[index].imageUrl = imageUrl;
        }
      }
      res.redirect("/?success=true");
    }
  });
});

app.post("/delete/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  posts = posts.filter((post) => post.id !== postId);

  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
