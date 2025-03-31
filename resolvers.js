import { MongoClient, ObjectId } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'bookstore';

async function getCollection() {
  if (!client.topology?.isConnected()) await client.connect();
  return client.db(dbName).collection('books');
}

export const resolvers = {
  Query: {
    books: async () => {
      const col = await getCollection();
      return await col.find({}).toArray();
    },
    searchBooks: async (_, { query }) => {
      const col = await getCollection();
      return await col.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { genre: { $regex: query, $options: 'i' } }
        ]
      }).toArray();
    },
  },
  Mutation: {
    addBook: async (_, { title, author, genre }) => {
      const col = await getCollection();
      const book = { title, author, genre };
      const result = await col.insertOne(book);
      return { _id: result.insertedId, ...book };
    },
    updateBook: async (_, { id, title, author, genre }) => {
      const col = await getCollection();
      const updates = {};
      if (title) updates.title = title;
      if (author) updates.author = author;
      if (genre) updates.genre = genre;
      await col.updateOne({ _id: new ObjectId(id) }, { $set: updates });
      return { _id: id, ...updates };
    },
    deleteBook: async (_, { id }) => {
      const col = await getCollection();
      const res = await col.deleteOne({ _id: new ObjectId(id) });
      return res.deletedCount === 1;
    },
  },
};
