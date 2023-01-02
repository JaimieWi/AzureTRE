data "local_file" "version" {
  filename = "${path.module}/../../../../resource_processor/_version.py"
}

data "azurerm_subscription" "current" {}

data "azurerm_client_config" "current" {}

data "template_file" "cloudconfig" {
  template = file("${path.module}/cloud-config.yaml")
  vars = {
    docker_registry_server                           = var.docker_registry_server
    terraform_state_container_name                   = var.terraform_state_container_name
    mgmt_resource_group_name                         = var.mgmt_resource_group_name
    mgmt_storage_account_name                        = var.mgmt_storage_account_name
    service_bus_deployment_status_update_queue       = var.service_bus_deployment_status_update_queue
    service_bus_resource_request_queue               = var.service_bus_resource_request_queue
    service_bus_namespace                            = "sb-${var.tre_id}.servicebus.windows.net"
    vmss_msi_id                                      = azurerm_user_assigned_identity.vmss_msi.client_id
    arm_subscription_id                              = data.azurerm_subscription.current.subscription_id
    arm_tenant_id                                    = data.azurerm_client_config.current.tenant_id
    resource_processor_vmss_porter_image_repository  = var.resource_processor_vmss_porter_image_repository
    resource_processor_vmss_porter_image_tag         = local.version
    app_insights_connection_string                   = var.app_insights_connection_string
    resource_processor_number_processes_per_instance = var.resource_processor_number_processes_per_instance
    key_vault_name                                   = var.key_vault_name
    rp_bundle_values                                 = local.rp_bundle_values_formatted
  }
}

data "template_cloudinit_config" "config" {
  gzip          = true
  base64_encode = true

  part {
    content_type = "text/cloud-config"
    content      = data.template_file.cloudconfig.rendered
  }
}
