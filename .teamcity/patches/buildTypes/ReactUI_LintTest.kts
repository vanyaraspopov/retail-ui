package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2018_2.*
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.PullRequests
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.pullRequests
import jetbrains.buildServer.configs.kotlin.v2018_2.buildFeatures.swabra
import jetbrains.buildServer.configs.kotlin.v2018_2.triggers.vcs
import jetbrains.buildServer.configs.kotlin.v2018_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = 'ReactUI_LintTest'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("ReactUI_LintTest")) {
    expectTemplates()
    templates = arrayListOf(RelativeId("ReactUI_GitHubFeatures"))

    vcs {
        remove(DslContext.settingsRoot.id!!)
    }

    expectSteps {
        step {
            name = "Install"
            type = "jonnyzzz.yarn"
            param("yarn_commands", "install")
        }
        step {
            name = "Lint"
            type = "jonnyzzz.yarn"
            param("yarn_commands", "workspace retail-ui lint")
        }
        step {
            name = "Test"
            type = "jonnyzzz.yarn"
            param("yarn_commands", "workspace retail-ui test")
        }
    }
    steps {
        items.removeAt(0)
        items.removeAt(0)
        items.removeAt(0)
    }

    triggers {
        remove {
            vcs {
                id = "TRIGGER_1"
                branchFilter = "+:pull/*"
            }
        }
    }

    features {
        remove {
            swabra {
                id = "BUILD_EXT_1"
                forceCleanCheckout = true
            }
        }
        remove {
            pullRequests {
                id = "BUILD_EXT_2"
                provider = github {
                    authType = token {
                        token = "credentialsJSON:37119025-2749-4abf-8ed8-ff4221b59d50"
                    }
                    filterAuthorRole = PullRequests.GitHubRoleFilter.MEMBER
                }
            }
        }
        remove {
            commitStatusPublisher {
                id = "BUILD_EXT_3"
                publisher = github {
                    githubUrl = "https://api.github.com"
                    authType = personalToken {
                        token = "credentialsJSON:37119025-2749-4abf-8ed8-ff4221b59d50"
                    }
                }
                param("github_oauth_user", "wKich")
            }
        }
    }
}
