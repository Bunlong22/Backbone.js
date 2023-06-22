// Model
var Todo = Backbone.Model.extend({
  defaults: {
    task: "",
    title: "",
    status: "",
  },
});

// Collection
var Todos = Backbone.Collection.extend({});

// Instantiate a collection
var todos = new Todos();

// View for one todo item
var TodoView = Backbone.View.extend({
  model: new Todo(),
  tagName: "tr",
  initialize: function () {
    this.template = _.template($(".todos-list-template").html());
  },
  events: {
    "click .edit-todo": "edit",
    "click .update-todo": "update",
    "click .cancel": "cancel",
    "click .delete-todo": "delete",
  },
  edit: function () {
    $(".edit-todo").hide();
    $(".delete-todo").hide();
    this.$(".update-todo").show();
    this.$(".cancel").show();

    var task = this.$(".task").html();
    var description = this.$(".description").html();
    var status = this.$(".status").html();

    this.$(".task").html(
      '<input type="text" class="form-control task-update" value="' +
        task +
        '">'
    );
    this.$(".description").html(
      '<input type="text" class="form-control description-update" value="' +
        description +
        '">'
    );
    this.$(".status").html(`
      <select class="form-control status-update">
        <option value="To do" ${status === "To do" ? "selected" : ""}>To do</option>
        <option value="Ongoing" ${status === "Ongoing" ? "selected" : ""}>Ongoing</option>
        <option value="Completed" ${status === "Completed" ? "selected" : ""}>Completed</option>
      </select>
    `);
  },
  update: function () {
    this.model.set("task", $(".task-update").val());
    this.model.set("description", $(".description-update").val());
    this.model.set("status", $(".status-update").val());
  },
  cancel: function () {
    todosView.render();
  },
  delete: function () {
    this.model.destroy();
  },
  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
});

// View for all todos
var TodosView = Backbone.View.extend({
  model: todos,
  el: $(".todos-list"),
  initialize: function () {
    var self = this;
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
  render: function () {
    var self = this;
    this.$el.html("");
    _.each(this.model.toArray(), function (todo) {
      self.$el.append(new TodoView({ model: todo }).render().$el);
    });
    return this;
  },
});

var todosView = new TodosView();

$(document).ready(function () {
  $(".add-todo").on("click", function () {
    var todo = new Todo({
      task: $(".task-input").val(),
      description: $(".description-input").val(),
      status: $(".status-input").val(),
    });
    $(".task-input").val("");
    $(".description-input").val("");
    $(".status-input").val("");
    console.log(todo.toJSON());
    todos.add(todo);
  });
});
