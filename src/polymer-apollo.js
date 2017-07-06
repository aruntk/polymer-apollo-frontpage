import gql from 'graphql-tag';
import { PolymerApolloMixin } from 'polymer-apollo';
import ApolloClient, { createNetworkInterface, addTypename } from 'apollo-client';

// Create the apollo client
const apolloClient = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://localhost:8080/graphql',
    transportBatching: true,
  }),
  dataIdFromObject: r => r.id,
});

// create an instance of PolymerApollo
// created instance is a polymer behavior

// GraphQL query
const postsQuery = gql`
  query allPosts {
    posts {
      id
      title
      votes
      author {
        id
        firstName
        lastName
      }
    }
  }
`;
const upvoteMutation = gql`
  mutation upvotePost($postId: Int!) {
    upvotePost(postId: $postId) {
      id
      votes
    }
  }
`;

export class PolymerApolloElement extends PolymerApolloMixin({ apolloClient }, Polymer.Element) {
// export class PolymerApolloElement extends Polymer.Element {
  constructor() {
    super();
  }
  static get is() {
    return 'polymer-apollo';
  }
  connectedCallback() {
    super.connectedCallback();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
  }
  static get properties() {
    return {
      posts: {
        type: Array,
        value: [],
      },

      loading: Boolean,
      postId: {
        type: Number,
        required: true,
      },
      // prop1:{
      // type:Object,
      // value:{
      // message:'App',
      // name:'polymer-apollo'
      // }
      // },
      // ping:String,

      sortedPosts: {
        type: Array,
        value: [],
      },
      skip: {
        type: Boolean,
        value: true,
      },
    };
  }
  static get observers() {
    return ['sortPosts(posts)'];
  }
  computedFn(s) {
    return {
      skip: s,
    };
  }
  unskip() {
    this.set('skip', false);
  }
  get apollo() {
    return {
      // Local state 'posts' data
      posts: {
        query: postsQuery,
        loadingKey: 'loading',
        options: 'computedFn(skip)',
      },
      // ping: {
      // query: gql`query PingMessage($message: String!) {
      // ping(message: $message)
      // }`,
      // variables: {
      // //====== properties in variables should have values with paths to element properties
      // //======= example
      // //======= limit: 'route.limit'
      // message:'prop1.message'
      // },
      // Additional options here
      // forceFetch: true,
      // },
    };
  }
  // Computed properties
  sortPosts(v) {
    if (v) {
      const unsorted = v.slice(0);
      this.set('sortedPosts', unsorted.sort((x, y) => {
        return y.votes - x.votes
      }));
    }
  }
  upvote(e) {
    // Mutation
    const postId = e.model.item.id;
    this.$apollo.mutate({
      mutation: upvoteMutation,
      variables: {
        postId,
      },
    });
  }
  refetchPost() {
    this.$apollo.refetch('posts');
  }
};
// console.log(PolymerApolloElement);
customElements.define('polymer-apollo', PolymerApolloElement);
