"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const glob = require("glob");
const { resolve } = require("path");
const remote = require("yeoman-remote");
const yoHelper = require("@feizheng/yeoman-generator-helper");
const replace = require("replace-in-file");

module.exports = class extends Generator {
  // initializing() {
  //   // this.composeWith("dotfiles:stdapp");
  // }

  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the stunning ${chalk.red(
          "generator-tiny-rails"
        )} generator!`
      )
    );

    const prompts = [
      {
        type: "input",
        name: "project_name",
        message: "Your project_name (eg: like this `react-button` )?",
        default: yoHelper.discoverRoot
      },
      {
        type: "input",
        name: "description",
        message: "Your description?"
      },
      {
        type: "input",
        name: "db_name",
        message: "Your db_name(eg: template)?"
      }
    ];

    return this.prompt(prompts).then(
      function (props) {
        // To access props later use this.props.someAnswer;
        this.props = props;
        yoHelper.rewriteProps(props);
      }.bind(this)
    );
  }

  install() {
    this.npmInstall();
  }

  writing() {
    const done = this.async();
    remote(
      "afeiship",
      "boilerplate-tiny-rails",
      function (err, cachePath) {
        // copy files:
        this.fs.copy(
          glob.sync(resolve(cachePath, "{**,.*}")),
          this.destinationPath()
        );
        yoHelper.rename(this, 'template', this.props.db_name);
        done();
      }.bind(this)
    );
  }

  end() {
    const { db_name, DbName, project_name, description } = this.props;
    const files = glob.sync(resolve(this.destinationPath(), "{**,.*}"));

    replace.sync({
      files,
      from: [
        /boilerplate_db_name/g,
        /BoilerplateDbName/g,
        /boilerplate-tiny-rails-description/g,
        /boilerplate-tiny-rails/g
      ],
      to: [db_name, DbName, description, project_name]
    });
  }
};
