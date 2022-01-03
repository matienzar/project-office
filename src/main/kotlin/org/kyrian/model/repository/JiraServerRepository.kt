package org.kyrian.model.repository

import io.quarkus.mongodb.panache.kotlin.PanacheMongoRepository
import org.kyrian.model.JiraServer
import javax.enterprise.context.ApplicationScoped

@ApplicationScoped
class JiraServerRepository: PanacheMongoRepository<JiraServer> {
    fun findAllActive() = list("active", true)
}