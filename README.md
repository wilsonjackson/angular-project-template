# angular-project-template

## Project setup and workflow

### Prerequisites

The following tools are required:

1. [nodejs/npm](http://nodejs.org/download/)
2. [gulpjs (globally installed)](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#getting-started)

### Creating a project

```
curl -L https://github.com/wilsonjackson/angular-project-template/archive/typescript.tar.gz | tar xz && mv angular-project-template-typescript projectname
```

Remember to replace _`projectname`_ with the name of your project.

### Installing project dependencies

```
npm install
```

### Running the test suite

```
gulp test
```

### Running the development server

```
gulp serve-dev
```

This will start a local server, running on port 8080 by default, that will serve the app. Changes to source files will
be reflected in real time, but changes to dependencies will require a server restart, as they are aggressively cached.

In addition to the main application source files (in the `src` directory), development-only source files (in the `dev`
directory) will also be served. The contents of `dev` are not included in a production build by default.

### Building for production

```
gulp build
```

Artifacts will be generated in the `build/dist` directory.

If you would like to include `dev` sources (for example, to test the production build when no backend is available),
you may instead run:

```
gulp build-dev
```

### Serving a production build

```
gulp serve
```

This will start a local server, running on port 8080 by default, that will serve the contents of `build/dist`. (Note
that this is not a production server, but rather a means to quickly test a production build.)
