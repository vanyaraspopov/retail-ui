import jetbrains.buildServer.configs.kotlin.v2018_2.*
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.PullRequests
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.Swabra
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.pullRequests
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.sshAgent
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.swabra
import jetbrains.buildServer.configs.kotlin.v2018_2.buildSteps.MSBuildStep
import jetbrains.buildServer.configs.kotlin.v2018_2.buildSteps.dotnetBuild
import jetbrains.buildServer.configs.kotlin.v2018_2.buildSteps.dotnetTest
import jetbrains.buildServer.configs.kotlin.v2018_2.buildSteps.msBuild
import jetbrains.buildServer.configs.kotlin.v2018_2.buildSteps.nunit
import jetbrains.buildServer.configs.kotlin.v2018_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2018_2.failureConditions.BuildFailureOnMetric
import jetbrains.buildServer.configs.kotlin.v2018_2.failureConditions.failOnMetricChange
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.schedule
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.vcs
import jetbrains.buildServer.configs.kotlin.v2018_2.ui.updateDisabledSettings
import jetbrains.buildServer.configs.kotlin.v2018_2.vcs.GitVcsRoot

/*
The settings script is an entry point for defining a TeamCity
project hierarchy. The script should contain a single call to the
project() function with a Project instance or an init function as
an argument.

VcsRoots, BuildTypes, Templates, and subprojects can be
registered inside the project using the vcsRoot(), buildType(),
template(), and subProject() methods respectively.

To debug settings scripts in command-line, run the

    mvnDebug org.jetbrains.teamcity:teamcity-configs-maven-plugin:generate

command and attach your debugger to the port 8000.

To debug in IntelliJ Idea, open the 'Maven Projects' tool window (View
-> Tool Windows -> Maven Projects), find the generate task node
(Plugins -> teamcity-configs -> teamcity-configs:generate), the
'Debug' option is available in the context menu for the task.
*/

version = "2019.1"

project {

  vcsRoot(RetailUiTags)
  vcsRoot(RetailUi)
  vcsRoot(ReactUiTestingTags)
  vcsRoot(ReactUiValidationsTags)

  buildType(RunAll)

  params {
    text("teamcity.runner.commandline.stdstreams.encoding", "UTF8", display = ParameterDisplay.HIDDEN, allowEmpty = true)
    param("teamcity.vcsTrigger.runBuildInNewEmptyBranch", "true")
  }

  features {
    feature {
      id = "PROJECT_EXT_65"
      type = "IssueTracker"
      param("secure:password", "")
      param("name", "skbkontur/retail-ui")
      param("pattern", """#(\d+)""")
      param("authType", "anonymous")
      param("repository", "https://github.com/skbkontur/retail-ui")
      param("type", "GithubIssues")
      param("secure:accessToken", "")
      param("username", "")
    }
    feature {
      id = "PROJECT_EXT_66"
      type = "OAuthProvider"
      param("clientId", "ac69bdb75bcac9b85bc2")
      param("defaultTokenScope", "public_repo,repo,repo:status,write:repo_hook")
      param("secure:clientSecret", "credentialsJSON:871d5d18-0142-4dfe-8479-f02f56356687")
      param("displayName", "GitHub.com")
      param("gitHubUrl", "https://github.com/")
      param("providerType", "GitHub")
    }
  }

  cleanup {
    all(days = 30)
  }
  buildTypesOrder = arrayListOf(RunAll)

  subProject(ReactUI)
  subProject(Validations)
  subProject(SeleniumTesting)

  template {
    id("ReactUI_GitHubFeatures")
    name = "GitHub Features"

    triggers {
      vcs {
        id = "VCS_TRIGGER"
        branchFilter = "+:pull/*"
      }
    }

    features {
      swabra {
        id = "SWABRA"
        forceCleanCheckout = true
        lockingProcesses = Swabra.LockingProcessPolicy.KILL
      }
      pullRequests {
        id = "PULL_REQUESTS"
        provider = github {
          authType = token {
            token = "credentialsJSON:37119025-2749-4abf-8ed8-ff4221b59d50"
          }
          filterAuthorRole = PullRequests.GitHubRoleFilter.MEMBER
        }
      }
      commitStatusPublisher {
        id = "COMMIT_STATUS_PUBLISHER"
        publisher = github {
          githubUrl = "https://api.github.com"
          authType = personalToken {
            token = "credentialsJSON:5b441be5-9aec-4b9d-80cf-975d778b95f5"
          }
        }
      }
    }
  }
}

object RunAll : BuildType({
  name = "Run All"

  allowExternalStatus = true
  type = BuildTypeSettings.Type.COMPOSITE

  vcs {
    root(RetailUi)

    showDependenciesChanges = true
  }

  triggers {
    schedule {
      schedulingPolicy = daily {
        hour = 0
      }
      branchFilter = "+:<default>"
      triggerBuild = always()
      withPendingChangesOnly = false
    }
  }

  features {
    pullRequests {
      provider = github {
        authType = token {
          token = "credentialsJSON:37119025-2749-4abf-8ed8-ff4221b59d50"
        }
        filterAuthorRole = PullRequests.GitHubRoleFilter.MEMBER
      }
    }
  }

  dependencies {
    snapshot(ReactUI_BuildRetailUi) {
    }
    snapshot(ReactUI_LintTest) {
    }
    snapshot(ReactUI_ScreenshotTests) {
    }
    snapshot(SeleniumTesting_Test) {
    }
    snapshot(Validations_Build) {
    }
    snapshot(Validations_LintTest) {
    }
  }
})

object ReactUiTestingTags : GitVcsRoot({
  name = "react-ui-testing tags"
  url = "https://github.com/skbkontur/retail-ui.git"
  branchSpec = "+:refs/tags/react-ui-testing@*"
  useTagsAsBranches = true
})

object ReactUiValidationsTags : GitVcsRoot({
  name = "react-ui-validations tags"
  url = "https://github.com/skbkontur/retail-ui.git"
  branchSpec = "+:refs/tags/react-ui-validations@*"
  useTagsAsBranches = true
})

object RetailUi : GitVcsRoot({
  name = "retail-ui"
  url = "https://github.com/skbkontur/retail-ui.git"
  branchSpec = """
        +:refs/heads/*
        +:refs/tags/*
    """.trimIndent()
  useTagsAsBranches = true
  authMethod = password {
    userName = "skbkontur-bot"
    password = "credentialsJSON:8159ccad-3d3e-43fa-9684-5cd8d9e83d0e"
  }
})

object RetailUiTags : GitVcsRoot({
  name = "retail-ui tags"
  url = "https://github.com/skbkontur/retail-ui.git"
  branchSpec = """
        +:refs/tags/@skbkontur/react-ui@*
    """.trimIndent()
  useTagsAsBranches = true
})


object ReactUI : Project({
  name = "ReactUI"

  buildType(ReactUI_LintTest)
  buildType(ReactUI_ScreenshotTests)
  buildType(ReactUI_BuildRetailUi)
  buildType(ReactUI_Publish)
  buildTypesOrder = arrayListOf(ReactUI_LintTest, ReactUI_ScreenshotTests, ReactUI_BuildRetailUi, ReactUI_Publish)
  defaultTemplate = RelativeId("ReactUI_GitHubFeatures")
})

object ReactUI_BuildRetailUi : BuildType({
  name = "Build"

  artifactRules = """
        packages\react-ui\.storybook\build\default => storybook-default-%build.number%.zip
        packages\react-ui\skbkontur-react-ui-%build.number%.tgz
    """.trimIndent()

  vcs {
    root(RetailUi)
  }

  steps {
    step {
      name = "Install"
      type = "jonnyzzz.yarn"
      param("yarn_commands", "install")
    }
    step {
      name = "Build"
      type = "jonnyzzz.yarn"
      param("yarn_commands", "workspace @skbkontur/react-ui build")
    }
    step {
      name = "Pack @skbkontur/react-ui"
      type = "jonnyzzz.yarn"
      param("yarn_commands", "workspace @skbkontur/react-ui --cwd ./build pack --filename skbkontur-react-ui-%build.counter%.tgz")
    }
  }
})

object ReactUI_LintTest : BuildType({
  name = "Lint/Test"

  artifactRules = "packages/react-ui-smoke-test/temp/reactUIControls.png => smokeReactUI.zip"

  vcs {
    root(RetailUi)
  }

  steps {
    step {
      name = "Install"
      type = "jonnyzzz.yarn"
      param("yarn_commands", "install")
    }
    step {
      name = "Lint"
      type = "jonnyzzz.yarn"
      param("yarn_commands", "workspace @skbkontur/react-ui lint")
    }
    step {
      name = "Test"
      type = "jonnyzzz.yarn"
      param("yarn_commands", "workspace @skbkontur/react-ui test")
    }
    step {
      name = "Smoke test"
      type = "jonnyzzz.yarn"
      param("yarn_commands", "workspace react-ui-smoke-test test")
    }
  }
})

object ReactUI_Publish : BuildType({
  name = "Publish"

  params {
    password("env.NPM_TOKEN", "credentialsJSON:2cea5b86-4e77-4fb6-b21f-c8f564c39fa6", display = ParameterDisplay.HIDDEN, readOnly = true)
  }

  vcs {
    root(RetailUi)
  }

  steps {
    step {
      name = "Install"
      type = "jonnyzzz.yarn"
      param("yarn_commands", "install")
    }
    step {
      name = "Auth"
      type = "jonnyzzz.npm"
      param("npm_commands", """config set "//registry.npmjs.org/:_authToken" "%env.NPM_TOKEN%"""")
    }
    step {
      name = "Publish"
      type = "jonnyzzz.yarn"
      param("yarn_commands", "workspace @skbkontur/react-ui release")
    }
    step {
      name = "Clean"
      type = "jonnyzzz.npm"
      executionMode = BuildStep.ExecutionMode.ALWAYS
      param("npm_commands", """config delete "//registry.npmjs.org/:_authToken"""")
    }
  }

  triggers {
    vcs {
      branchFilter = "+:@skbkontur/react-ui@*"
    }
  }

  features {
    sshAgent {
      teamcitySshKey = "GitHub"
    }
  }

  updateDisabledSettings("VCS_TRIGGER", "PULL_REQUESTS", "COMMIT_STATUS_PUBLISHER")
})


object ReactUI_ScreenshotTests : BuildType({
  name = "Screenshot tests"

  artifactRules = "packages/react-ui/.creevey/report => report.zip"

  vcs {
    root(RetailUi)
  }

  steps {
    step {
      name = "Install"
      type = "jonnyzzz.yarn"
      param("yarn_commands", "install")
    }
    step {
      name = "Build Storybook"
      type = "jonnyzzz.yarn"
      param("yarn_commands", "workspace @skbkontur/react-ui storybook:build")
    }
    script {
      name = "Start"
      scriptContent = """
                start /b yarn workspace @skbkontur/react-ui storybook:serve
                ping 127.0.0.1 -n 11
            """.trimIndent()
    }
    step {
      name = "Test UI"
      type = "jonnyzzz.yarn"
      param("yarn_commands", "workspace @skbkontur/react-ui creevey")
    }
  }

  failureConditions {
    failOnMetricChange {
      metric = BuildFailureOnMetric.MetricType.BUILD_DURATION
      threshold = 3600
      units = BuildFailureOnMetric.MetricUnit.DEFAULT_UNIT
      comparison = BuildFailureOnMetric.MetricComparison.MORE
      compareTo = value()
      stopBuildOnFailure = true
      param("anchorBuild", "lastSuccessful")
    }
  }
})


object SeleniumTesting : Project({
  name = "SeleniumTesting"

  buildType(SeleniumTesting_Publish)
  buildType(SeleniumTesting_Test)
  buildTypesOrder = arrayListOf(SeleniumTesting_Test, SeleniumTesting_Publish)
  defaultTemplate = RelativeId("ReactUI_GitHubFeatures")
})

object SeleniumTesting_Publish : BuildType({
  name = "Publish"

  artifactRules = "packages/react-ui-testing/Output/*.nupkg"

  vcs {
    root(ReactUiTestingTags)

    branchFilter = """
            +:*
            -:<default>
        """.trimIndent()
  }

  steps {
    step {
      name = "Install"
      type = "jb.nuget.installer"
      param("nuget.path", "%teamcity.tool.NuGet.CommandLine.DEFAULT%")
      param("nuget.updatePackages.mode", "sln")
      param("sln.path", "packages/react-ui-testing/SeleniumTesting.sln")
    }
    dotnetBuild {
      name = "Build"
      projects = "packages/react-ui-testing/SeleniumTesting/SeleniumTesting.csproj"
      configuration = "Release"
      versionSuffix = "%teamcity.build.branch%"
      param("dotNetCoverage.dotCover.home.path", "%teamcity.tool.JetBrains.dotCover.CommandLineTools.DEFAULT%")
    }
    step {
      name = "Publish"
      type = "jb.nuget.publish"
      param("secure:nuget.api.key", "credentialsJSON:b87415ec-fb4b-4489-80dd-03e53cd922e5")
      param("nuget.path", "%teamcity.tool.NuGet.CommandLine.4.9.2%")
      param("nuget.publish.source", "https://api.nuget.org/v3/index.json")
      param("nuget.publish.files", "packages/react-ui-testing/Output/*.nupkg")
    }
  }

  triggers {
    vcs {
    }
  }
  updateDisabledSettings("VCS_TRIGGER", "PULL_REQUESTS", "COMMIT_STATUS_PUBLISHER")
})

object SeleniumTesting_Test : BuildType({
  name = "Test"

  artifactRules = "packages/react-ui-testing/.screenshots => screenshots.zip"

  params {
    password("env.SAUCE_ACCESS_KEY", "credentialsJSON:a904ff94-f240-4ebf-af85-84e605d62caa", display = ParameterDisplay.HIDDEN, readOnly = true)
    password("env.SAUCE_USERNAME", "credentialsJSON:5e3c7241-13cd-4d36-ac4f-a8dceb001153", display = ParameterDisplay.HIDDEN, readOnly = true)
  }

  vcs {
    root(RetailUi)
  }

  steps {
    step {
      name = "Install"
      type = "jonnyzzz.yarn"
      param("yarn_commands", "install")
    }
    step {
      name = "Build"
      type = "jonnyzzz.yarn"
      param("yarn_commands", """
                workspace @skbkontur/react-ui build
                workspace react-ui-testing build
            """.trimIndent())
    }
    script {
      name = "Start"
      scriptContent = """
                start /b yarn workspace react-ui-testing start
                ping 127.0.0.1 -n 11
            """.trimIndent()
    }
    dotnetTest {
      name = "Test"
      projects = "packages/react-ui-testing/Tests/Tests.csproj"
      framework = "netcoreapp2.1"
      param("dotNetCoverage.dotCover.home.path", "%teamcity.tool.JetBrains.dotCover.CommandLineTools.DEFAULT%")
    }
  }
})


object Validations : Project({
  name = "Validations"

  buildType(Validations_Build)
  buildType(Validations_LintTest)
  buildType(Validations_Publish)
  buildTypesOrder = arrayListOf(Validations_LintTest, Validations_Build, Validations_Publish)
  defaultTemplate = RelativeId("ReactUI_GitHubFeatures")
})

object Validations_Build : BuildType({
  name = "Build"

  artifactRules = """
        packages\react-ui-validations\react-ui-validations-*.tgz
        packages\react-ui-validations\skbkontur-react-ui-validations-*.tgz
    """.trimIndent()

  vcs {
    root(RetailUi)
  }

  steps {
    step {
      name = "Install"
      type = "jonnyzzz.yarn"
      param("yarn_commands", "install")
    }
    step {
      name = "Build"
      type = "jonnyzzz.yarn"
      param("yarn_commands", "workspace react-ui-validations build")
    }
    step {
      name = "PreDeploy"
      type = "jonnyzzz.yarn"
      param("yarn_commands", "workspace react-ui-validations predeploy")
    }
    step {
      name = "Pack react-ui-validations"
      type = "jonnyzzz.yarn"
      param("yarn_commands", "workspace react-ui-validations --cwd ./build/retail-ui-dist/ pack --filename react-ui-validations-%build.counter%.tgz")
    }
    step {
      name = "Pack @skbkontur/react-ui-validations"
      type = "jonnyzzz.yarn"
      param("yarn_commands", "workspace react-ui-validations --cwd ./build/react-ui-dist/ pack --filename skbkontur-react-ui-validations-%build.counter%.tgz")
    }
  }
})

object Validations_LintTest : BuildType({
  name = "Lint/Test"

  vcs {
    root(RetailUi)
  }

  steps {
    step {
      name = "Install"
      type = "jonnyzzz.yarn"
      param("yarn_commands", "install")
    }
    step {
      name = "Lint"
      type = "jonnyzzz.yarn"
      param("yarn_commands", "workspace react-ui-validations lint")
    }
    step {
      name = "Run unit tests"
      type = "jonnyzzz.yarn"
      param("yarn_commands", "workspace react-ui-validations test")
    }
    script {
      name = "Start Storybook"
      scriptContent = """
                start /b yarn workspace react-ui-validations storybook
                ping 127.0.0.1 -n 60
            """.trimIndent()
    }
    step {
      name = "NuGet Restore"
      type = "jb.nuget.installer"
      param("nuget.path", "%teamcity.tool.NuGet.CommandLine.4.9.3%")
      param("nuget.updatePackages.mode", "sln")
      param("sln.path", "packages/react-ui-validations/selenium-tests/SeleniumTests.sln")
    }
    msBuild {
      name = "Build tests"
      path = "packages/react-ui-validations/selenium-tests/SeleniumTests.sln"
      version = MSBuildStep.MSBuildVersion.V15_0
      toolsVersion = MSBuildStep.MSBuildToolsVersion.V15_0
      param("dotNetCoverage.dotCover.home.path", "%teamcity.tool.JetBrains.dotCover.CommandLineTools.DEFAULT%")
    }
    nunit {
      name = "Run tests"
      nunitPath = "%teamcity.tool.NUnit.Console.DEFAULT%"
      includeTests = """packages\react-ui-validations\selenium-tests\ValidationTests\bin\Debug\ValidationTests.dll"""
      param("dotNetCoverage.dotCover.home.path", "%teamcity.tool.JetBrains.dotCover.CommandLineTools.DEFAULT%")
    }
  }
})

object Validations_Publish : BuildType({
  name = "Publish"

  params {
    password("env.NPM_TOKEN", "credentialsJSON:2cea5b86-4e77-4fb6-b21f-c8f564c39fa6", display = ParameterDisplay.HIDDEN, readOnly = true)
  }

  vcs {
    root(ReactUiValidationsTags)

    branchFilter = """
            +:*
            -:<default>
        """.trimIndent()
  }

  steps {
    step {
      name = "Install"
      type = "jonnyzzz.yarn"
      param("yarn_commands", "install")
    }
    step {
      name = "Build"
      type = "jonnyzzz.yarn"
      param("yarn_commands", "workspace react-ui-validations build")
    }
    step {
      name = "Auth"
      type = "jonnyzzz.npm"
      param("npm_commands", """config set "//registry.npmjs.org/:_authToken" "%env.NPM_TOKEN%"""")
    }
    step {
      name = "Publish"
      type = "jonnyzzz.yarn"
      param("yarn_commands", "workspace react-ui-validations deploy")
    }
    step {
      name = "Clean"
      type = "jonnyzzz.npm"
      executionMode = BuildStep.ExecutionMode.ALWAYS
      param("npm_commands", """config delete "//registry.npmjs.org/:_authToken"""")
    }
  }

  triggers {
    vcs {
    }
  }

  features {
    sshAgent {
      teamcitySshKey = "GitHub"
    }
  }
  updateDisabledSettings("VCS_TRIGGER", "PULL_REQUESTS", "COMMIT_STATUS_PUBLISHER")
})
