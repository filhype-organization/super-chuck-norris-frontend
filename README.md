![Alt chuck](src/assets/Logo_Chuck_Norris2.png)

# Chuck Norris Front

All documentation is available at this place: https://filhype-organization.github.io/super-chuck-norris-doc/

## Development server

Set environment variables for backend and authentication, ex: 

**Linux/MacOS/WSL:**
```bash
export NG_APP_API_URL="http://localhost:8080"
export NG_APP_AUTH_URL="http://localhost:8180"
export NG_APP_CLIENT_ID="front"
```

**Windows PowerShell:**
```powershell
$env:NG_APP_API_URL="http://localhost:8080"
$env:NG_APP_AUTH_URL="http://localhost:8180"
$env:NG_APP_CLIENT_ID="front"
```

**Windows Command Prompt:**
```cmd
set NG_APP_API_URL=http://localhost:8080
set NG_APP_AUTH_URL=http://localhost:8180
set NG_APP_CLIENT_ID=front
```
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
