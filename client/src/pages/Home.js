import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { Grid, Transition } from 'semantic-ui-react';

import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { AuthContext } from '../context/auth';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function Home() {
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  if (loading) return <h1>Loading Posts...</h1>;

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {data.getPosts.map(post => (
          <Transition.Group key={post.id}>
            <Grid.Column style={{ marginBottom: 20 }}>
              <PostCard post={post} />
            </Grid.Column>
          </Transition.Group>
        ))}
      </Grid.Row>
    </Grid>
  );
}

export default Home;
