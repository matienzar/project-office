package org.kyrian.api

import org.kyrian.bean.JiraInstanceBean
import javax.inject.Inject
import javax.ws.rs.GET
import javax.ws.rs.Path

@Path("/jira-instance")
class JiraInstaceResource {

    @Inject
    lateinit var bean: JiraInstanceBean

    @GET
    @Path("/init")
    fun init() = bean.init()

    @GET
    @Path("/find-active")
    fun findActive() = bean.listJiraActiveInstances()

}