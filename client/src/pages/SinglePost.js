import React, { useContext, useRef, useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';
import {
  Button,
  Card,
  Grid,
  Image,
  Icon,
  Label,
  Form,
  Transition
} from 'semantic-ui-react';
import moment from 'moment';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import MyPopup from '../util/MyPopup';

export default function SinglePost(props) {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);

  const { loading, data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  });

  const [comment, setComment] = useState('');

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment('');
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment
    }
  });

  function deletePostCallback() {
    props.history.push('/');
  }

  let postMarkup = <p>Loasing post...</p>;

  if (loading) {
    return postMarkup;
  }

  const {
    id,
    body,
    createdAt,
    username,
    comments,
    likes,
    likeCount,
    commentCount
  } = data.getPost;

  postMarkup = (
    <Grid>
      <Grid.Row>
        <Grid.Column width={2}>
          <Image
            src="https://react.semantic-ui.com/images/avatar/large/molly.png"
            size="small"
            float="right"
          />
        </Grid.Column>
        <Grid.Column width={10}>
          <Card fluid>
            <Card.Content>
              <Card.Header>{username}</Card.Header>
              <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
              <Card.Description>{body}</Card.Description>
            </Card.Content>
            <hr />
            <Card.Content extra>
              <LikeButton user={user} post={{ id, likeCount, likes }} />
              <MyPopup content="Comment Post">
                <Button
                  as="div"
                  labelPosition="right"
                  onClick={() => console.log('Comment!!!')}
                >
                  <Button basic color="blue">
                    <Icon name="comments" />
                  </Button>
                  <Label basic color="blue" pointing="left">
                    {commentCount}
                  </Label>
                </Button>
              </MyPopup>
              {user && user.username === username && (
                <DeleteButton postId={id} callback={deletePostCallback} />
              )}
            </Card.Content>
          </Card>
          {user && (
            <Card fluid>
              <Card.Content>
                <p>Post a Comment:</p>
                <Form>
                  <div className="ui action input fluid">
                    <input
                      type="text"
                      placeholder="Comment..."
                      name="comment"
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      ref={commentInputRef}
                    />
                    <button
                      type="submit"
                      className="ui button teal"
                      disabled={comment.trim() === ''}
                      onClick={submitComment}
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              </Card.Content>
            </Card>
          )}
          <Transition.Group>
            {comments.map(comment => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Transition.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );

  return postMarkup;
}

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;
