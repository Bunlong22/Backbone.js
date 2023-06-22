// Define a to-do item
var Todo = Backbone.Model.extend({
  defaults: {
    task: "",
    title: "",
    status: "",
  },
});

// Create a collection of to-do items
var Todos = Backbone.Collection.extend({});

// Make a list to hold all the to-do items
var todos = new Todos();

// Create a view for a single to-do item
var TodoView = Backbone.View.extend({
  model: new Todo(),
  tagName: "tr",
  initialize: function () {
    // Use a template to show the to-do item
    this.template = _.template($(".todos-list-template").html());
  },
  events: {
    "click .edit-todo": "edit",
    "click .update-todo": "update",
    "click .cancel": "cancel",
    "click .delete-todo": "delete",
  },
  // When the "Edit" button is clicked
  edit: function () {
    // Hide the "Edit" and "Delete" buttons after clicked then it shows
    $(".edit-todo").hide();
    $(".delete-todo").hide();
    // Show the "Update" and "Cancel" buttons first
    this.$(".update-todo").show();
    this.$(".cancel").show();

    // Get the current task, description, and status
    var task = this.$(".task").html();
    var description = this.$(".description").html();
    var status = this.$(".status").html();

    // Replace the task, description, and status with input fields
    this.$(".task").html('<input type="text" class="form-control task-update" value="' + task + '">');
    this.$(".description").html('<input type="text" class="form-control description-update" value="' + description + '">');
    this.$(".status").html(`
      <select class="form-control status-update">
        <option value="To do" ${status === "To do" ? "selected" : ""}>To do</option>
        <option value="Ongoing" ${status === "Ongoing" ? "selected" : ""}>Ongoing</option>
        <option value="Completed" ${status === "Completed" ? "selected" : ""}>Completed</option>
      </select>
    `);
  },
  // When the "Update" button is clicked
  update: function () {
    // Update the task, description, and status with the new values
    this.model.set("task", $(".task-update").val());
    this.model.set("description", $(".description-update").val());
    this.model.set("status", $(".status-update").val());
  },

  cancel: function () {
    // Refresh the list to show the original to-do items
    todosView.render();
  },

  delete: function () {
    // Remove the to-do item
    this.model.destroy();
  },
  // Render the to-do item
  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
});

// Create a view for all the to-do items
var TodosView = Backbone.View.extend({
  model: todos,
  el: $(".todos-list"),
  initialize: function () {
    var self = this;
    // When a new to-do item is added, changed, or removed, re-render the list
    this.model.on("add", this.render, this);
    this.model.on(
      "change",
      function () {
        setTimeout(function () {
          self.render();
        }, 30);
      },
      this
    );
    this.model.on("remove", this.render, this);
  },
  // Render all the to-do items
  render: function () {
    var self = this;
    this.$el.html("");
    _.each(this.model.toArray(), function (todo) {
      self.$el.append(new TodoView({ model: todo }).render().$el);
    });
    return this;
  },
});

// Create a view for the entire list of to-do items
var todosView = new TodosView();

// When the "Add" button is clicked
$(document).ready(function () {
  $(".add-todo").on("click", function () {
    // Create a new to-do item with the task, description, and status provided
    var todo = new Todo({
      task: $(".task-input").val(),
      description: $(".description-input").val(),
      status: $(".status-input").val(),
    });
    // Clear the input fields
    $(".task-input").val("");
    $(".description-input").val("");
    $(".status-input").val("");
    // Add the new to-do item to the list
    todos.add(todo);
  });
});
