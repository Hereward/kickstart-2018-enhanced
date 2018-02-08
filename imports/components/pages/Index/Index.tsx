import * as React from "react";
import { withTracker } from "meteor/react-meteor-data";
import * as ReactDOM from "react-dom";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Checkbox from 'material-ui/Checkbox';
import { Tasks } from "../../../api/tasks/publish";
import Task from "../../partials/Task";
import * as Methods from "../../../api/tasks/methods";
import * as Library from "../../../modules/library";

interface IProps {
  history: any;
  signedIn: any;
  ShortTitle: any;
  UserName: any;
  tasks: any;
  currentUser: any;
  incompleteCount: number;
  taskCount: number;
}

interface IState {
  hideCompleted: boolean;
  textInput: any;
}

class Index extends React.Component<IProps, IState> {
  textInputDOM: any;
  constructor(props) {
    super(props);

    this.toggleHideCompleted = this.toggleHideCompleted.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      hideCompleted: false,
      textInput: ""
    };
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const text = this.state.textInput; //ReactDOM.findDOMNode(this.state.textInput).value.trim();

    let taskFields = { text: text };

    Methods.create.call(taskFields, (err, res) => {
      //console.log("createTask.call");
      if (err) {
        Library.modalErrorAlert(err.reason);
      } else {
        //console.log(`task successfully created`);
      }
    });

    // Clear form
    //ReactDOM.findDOMNode(this.textInputDOM).value = "";
    //this.textInputDOM.value = "";
    this.setState({ textInput: "" });
  }

  handleChange(e) {
    let target = e.target;
    let value = target.value;
    let id = target.id;

    this.setState({ [id]: value });
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted
    });
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;

    //console.log(filteredTasks);
    return filteredTasks.map(task => {
      const currentUserId =
        this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return (
        <Task
          task={task}
          key={task._id}
          taskLabel={task.text}
          showPrivateButton={showPrivateButton}
          hide={this.state.hideCompleted && task.checked}
        />
      );
    });
  }

  getForm() {
    if (this.props.currentUser) {
      return (
        <form id="todos-form" className="new-task" onSubmit={this.handleSubmit}>
          <input
            type="text"
            ref={textInput => (this.textInputDOM = textInput)}
            id="textInput"
            placeholder="Type here &amp; hit return to add new tasks"
            value={this.state.textInput}
            onChange={this.handleChange}
          />
        </form>
      );
    }
  }

  getCheckBox() {
    if (this.props.currentUser) {
      return (
        <MuiThemeProvider>
          <Checkbox
            label="Hide Completed Tasks"
            checked={this.state.hideCompleted}
            onClick={this.toggleHideCompleted}
          />
        </MuiThemeProvider>
      );
    }
  }

  render() {
    let tasks: any;
    tasks = this.props.taskCount ? <div>Loading...</div> : <div />;

    if (this.props.tasks) {
      tasks = this.renderTasks();
    }

    return (
      <div className="container">
        <div className="todos-top-section">
          <h1>Todo List ({this.props.incompleteCount})</h1>
          <div className="todos-form-wrapper">
            {this.getCheckBox()}
            {this.getForm()}
          </div>
        </div>
        <ul>{tasks}</ul>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe("userData");
  let tasksDataReady = Meteor.subscribe("tasks");
  let tasks: any;
  let count = 0;

  let query = Tasks.find({}, { sort: { createdAt: -1 } });
  count = query.count();
  //console.log(`COUNT = ${count}`);
  //tasks = Tasks.find({}, { sort: { createdAt: -1 } }).fetch();

  if (count) {
    tasks = query.fetch();
  }

  return {
    tasks: tasks,
    taskCount: count,
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user()
  };
})(Index);
