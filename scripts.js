// Model

var Blog = Backbone.Model.extend({
  defaults: {
    task: "",
    title: "",
    status: "",
  },
});

// Backbone Collection

var Blogs = Backbone.Collection.extend({});

// instantiate a Collection

var blogs = new Blogs();

// Backbone View for one blog

var BlogView = Backbone.View.extend({
  model: new Blog(),
  tagName: "tr",
  initialize: function () {
    this.template = _.template($(".blogs-list-template").html());
  },
  events: {
    "click .edit-blog": "edit",
    "click .update-blog": "update",
    "click .cancel": "cancel",
    "click .delete-blog": "delete",
  },
  edit: function () {
    $(".edit-blog").hide();
    $(".delete-blog").hide();
    this.$(".update-blog").show();
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
      <option value="To do" ${
        status === "To do" ? "selected" : ""
      }>To do</option>
      <option value="Ongoing" ${
        status === "Ongoing" ? "selected" : ""
      }>Ongoing</option>
      <option value="Completed" ${
        status === "Completed" ? "selected" : ""
      }>Completed</option>
    </select>
  `);
  },
  update: function () {
    this.model.set("task", $(".task-update").val());
    this.model.set("description", $(".description-update").val());
    this.model.set("status", $(".status-update").val());
  },
  cancel: function () {
    blogsView.render();
  },
  delete: function () {
    this.model.destroy();
  },
  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
});

// Backbone View for all blogs

var BlogsView = Backbone.View.extend({
  model: blogs,
  el: $(".blogs-list"),
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
    _.each(this.model.toArray(), function (blog) {
      self.$el.append(new BlogView({ model: blog }).render().$el);
    });
    return this;
  },
});

var blogsView = new BlogsView();

$(document).ready(function () {
  $(".add-blog").on("click", function () {
    var blog = new Blog({
      task: $(".task-input").val(),
      description: $(".description-input").val(),
      status: $(".status-input").val(),
    });
    $(".task-input").val("");
    $(".description-input").val("");
    $(".status-input").val("");
    console.log(blog.toJSON());
    blogs.add(blog);
  });
});
