import { db } from '../firebase';
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';

// Add a new blog post
export const addBlogPost = async (post) => {
  post.date_posted = Timestamp.fromDate(new Date());
  return await addDoc(collection(db, 'blogPosts'), post);
};

// Get all blog posts
export const getBlogPosts = async () => {
  const querySnapshot = await getDocs(collection(db, 'blogPosts'));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};