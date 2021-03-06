import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from './Posts.module.css';

const Posts = () => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('Create Post');
  const [boolNew, setBoolNew] = useState(false);

  useEffect(() => {
    axios.get('/posts/', { withCredentials: true })
      .then((res) => {
        setPosts(res.data);
      });
  }, [boolNew]);

  useEffect(() => {
    axios.get('/users/self', { withCredentials: true })
      .then((res) => {
        setAuthor(res.data.name);
        setRole(res.data.role);
      })
      .catch((err) => {
        alert(`${err.response.data.message}`);
        router.push('/login');
      });
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    axios({
      url: '/posts/create',
      method: 'POST',
      data: { author, content },
      withCredentials: true,
    })
      .then((res) => {
        setMessage(res.data.message);
        if (res.statusText === 'OK') {
          const bool = boolNew;
          setBoolNew(!bool);
        }
      })
      .catch((err) => {
        setMessage(err.response.data.message);
      });
  };

  const changeContent = (e) => {
    setContent(e.target.value);
  };

  const createPost = () => (
    <div className={styles.container}>
      <form>
        <h1>{message}</h1>
        <input id={styles.content} type="text" placeholder="Enter your message here!" required onChange={changeContent} />
        <button type="submit" className={styles.submitBtn} onClick={submitHandler}>Post</button>
      </form>
    </div>
  );

  const sortedPosts = [].concat(posts);
  sortedPosts.sort((a, b) => b.timeStamp - a.timeStamp);

  const DisplayPost = sortedPosts.map((post) => (
    <div className={styles.postBody}>
      <div className={styles.contentAndAuthor}>
        <div className={styles.content}>
          {post.content}
        </div>
        <div className="author">
          {post.author}
        </div>
      </div>
      <div className="date">
        {post.date}
      </div>
    </div>
  ));

  return (
    <div>
      { role === 'teacher' ? createPost() : ''}
      <div className={styles.allPosts}>
        { DisplayPost }
      </div>
    </div>
  );
};

export default Posts;
