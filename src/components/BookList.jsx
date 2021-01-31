import SingleBook from "./SingleBook";
import ScrollDebounce from "../functions/ScrollDebounce";

const { Component } = require("react");
const { Col, Container, Row, Spinner, Alert } = require("react-bootstrap");

class BookList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      loading: true,
      error: null,
      next_books: null,
    };

    // Infifite scroll
    ScrollDebounce(this);
  }

  componentDidMount = () => {
    this.refreshList();
  };

  refreshList = async (query) => {
    this.setState({ loading: true });
    const { currentCategory } = this.props;
    let url = process.env.REACT_APP_API_URL + "/books";

    try {
      let currentQuery = query ? query : "?limit=10&offset=0";
      if (currentCategory !== "all") {
        currentQuery += `&category=${currentCategory}`;
        this.setState({ books: [] });
      }

      if (this.props.searchQuery) {
        console.log(this.props.searchQuery);
        currentQuery += `&title=${this.props.searchQuery}`;
      }

      const request = await fetch(url + currentQuery);

      if (request.ok) {
        const { books, next } = await request.json();
        console.log("books", books);

        this.setState({
          books: [...this.state.books, ...books],
          loading: false,
          next_books: next,
        });
      } else {
        this.setState({
          error: "Something went wrong. Try to refresh the page",
          loading: false,
        });
      }
    } catch (error) {
      this.setState({
        error: "Something went wrong. Try to refresh the page",
        loading: false,
      });
      console.log(error);
    }
  };

  componentDidUpdate = (prevProps) => {
    if (
      prevProps.currentCategory !== this.props.currentCategory ||
      prevProps.searchQuery !== this.props.searchQuery
    ) {
      this.refreshList();
    }
  };

  render() {
    const { books, loading, error } = this.state;
    return (
      <Container style={{ minHeight: "80vh" }}>
        {error && <Alert variant="danger">{error}</Alert>}

        <Row xs={2} sm={2} md={3} lg={4} xl={5}>
          {books.length &&
            books.map((book, idx) => {
              return (
                <Col className="my-2 px-1" key={idx}>
                  <SingleBook book={book} />
                </Col>
              );
            })}
        </Row>
        {loading && (
          <Spinner animation="border" variant="warning" className="mt-5" />
        )}
      </Container>
    );
  }
}

export default BookList;
