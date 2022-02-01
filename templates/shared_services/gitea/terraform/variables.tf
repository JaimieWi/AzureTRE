variable "tre_id" {
  type        = string
  description = "Unique TRE ID"
}

variable "location" {
  type        = string
  description = "Azure location (region) for deployment of core TRE services"
}

variable "gitea_allowed_fqdns" {
  type        = string
  description = "comma seperated string of allowed FQDNs for Gitea"
  default     = "github.com, www.github.com, api.github.com, git-lfs.github.com, *githubusercontent.com"
}

variable "gitea_storage_limit" {
  type        = number
  description = "Space allocated in GB for the Gitea data in Azure Files Share"
  default     = 1024
}

// TODO: better descriptions
variable "mgmt_resource_group_name" {
  type = string
  description = "Resource group name for TRE management"
}

variable "acr_name" {
  type = string
  description = "Name of Azure Container Registry"
}

// TODO: descriptions
variable "arm_tenant_id" {}
variable "arm_client_id" {}
variable "arm_client_secret" {}
