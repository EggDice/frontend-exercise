import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import { styled } from '@mui/material/styles';


const Feed: NextPage = ({ posts }) => {
  return (
    <>
    <Head>
      <title>Feed</title>
      <link rel="shortcut icon" href="/favicon.ico" />
    </Head>

    <Grid
      container
      spacing={2}
      direction="column"
      alignItems="center"
      style={{ minHeight: '100vh', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}
    >
      {
        posts.map(post => <Grid key={post.id} item>
            <Post post={post} />
        </Grid>)
      }
    </Grid>
    </>
  );
};

const Post = ({ post }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
   setExpanded(!expanded);
  };

  return (
    <Card aria-label="post">
      <CardHeader title={post.title}/>
      <CardContent>
        <Typography variant="body1">{ post.body }</Typography>
      </CardContent>
      { post.comments.length ? <CardActions onClick={handleExpandClick}>
        <Typography variant="body1">{ post.comments.length } comment(s):</Typography>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show comments"
        >
          <ExpandMoreIcon/>
        </ExpandMore>
      </CardActions> : <></> }
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {post.comments.map(comment => <Card key={comment.id} aria-label="comment">
          <CardContent>
            <Typography variant="h6">{comment.name}</Typography>
            <Typography variant="body2">{comment.body}</Typography>
          </CardContent>
        </Card>)}
      </Collapse>
    </Card>
  );
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export async function getServerSideProps() {
  // Fetch data from external API
  const postRes = await fetch(`https://jsonplaceholder.typicode.com/posts`);
  const rawPosts = await postRes.json();
  const posts = await Promise.all(rawPosts.map(async (post) => {
    const commentRes = await fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`);
    const commentsForPost = await commentRes.json();
    return { ...post, comments: commentsForPost };
  }));

  // Pass data to the page via props
  return { props: { posts } }
}

export default Feed;
