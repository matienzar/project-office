package org.kyrian.bean

import org.kyrian.model.JiraServer
import org.kyrian.model.repository.JiraServerRepository
import javax.enterprise.context.RequestScoped
import javax.inject.Inject

@RequestScoped
class JiraInstanceBean {

    @Inject
    lateinit var jiraServerRepository: JiraServerRepository

    fun init() {
        val jira = JiraServer();
        jira.url = "https://jira.instance.es"
        jira.userName = "username"
        jira.userPassword = "password"
        jira.instanceName = "JIRA_INSTANCE_1"

        jiraServerRepository.deleteAll()
        jiraServerRepository.persist(jira)
    }

    fun listJiraActiveInstances(): Collection<JiraServer> = jiraServerRepository.findAllActive()

}