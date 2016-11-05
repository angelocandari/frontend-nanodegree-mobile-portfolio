module.exports = function(grunt) {
  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
      responsive_images: {
        dev: {
          options: {
            engine: "gm",
            sizes: [{
              width: 700,
              quality:20
            }]
          },

          files: [{
            expand: true,
            src: ["**/*.{gif,jpg,png}"],
            cwd: "views/images/",
            dest: "views/images/"
          }]
        }
      }
  });

  grunt.registerTask("default", [
    "responsive_images"
  ]);
}
