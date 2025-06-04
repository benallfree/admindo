/**
 * AdminDO Hono Integration - Type Definitions
 */

import { Hono } from 'hono'

/**
 * Represents an instance of a Durable Object
 */
export interface DurableObjectInstance {
  /** The unique slug identifier for the instance */
  slug: string
  /** The display name of the instance */
  name: string
}

/**
 * Plugin configuration for AdminDO Hono integration
 */
export interface Plugin {
  /** The unique slug identifier for the plugin */
  slug: string
  /** Plugin scope - 'global' appears in sidebar, 'instance' appears only as tabs when viewing DO instances */
  scope: 'global' | 'instance'
  /** Function that creates a Hono app instance for the plugin */
  create: (config: any) => Hono
  /** Function that checks if the plugin is compatible with the given DO class */
  isCompatible: (DOClass: typeof DurableObject) => boolean
}

/**
 * Configuration for a single Durable Object
 */
export interface DurableObjectConfigItem {
  /** The name of the Durable Object */
  name: string
  /** Reference to the Durable Object class for compatibility checking */
  classRef: typeof DurableObject
  /** Function to get instances, optionally paginated */
  getInstances: (page?: number) => Promise<DurableObjectInstance[]>
  /** List of compatible plugin slugs (populated at runtime) */
  compatiblePlugins?: string[]
}

/**
 * Configuration object for Durable Objects
 */
export type DurableObjectConfig = Record<string, DurableObjectConfigItem>

/**
 * Main AdminDO configuration object
 */
export interface AdminDOConfig {
  /** The base path for the AdminDO API */
  basePath: string
  /** Whether to enable demo mode */
  demo: boolean
  /** Array of Durable Object configurations that will be registered with AdminDO */
  dos: DurableObjectConfig
  /** Array of plugin configurations that will be registered with AdminDO */
  plugins: Plugin[]
}

/**
 * Create AdminDO instance integrated with Hono
 */
export declare function admindo(config: AdminDOConfig): Hono

/**
 * Symbol used to identify AdminDO instances on Durable Objects
 */
export declare const ADMIN_DO: unique symbol

/**
 * Interface for objects that expose AdminDO functionality
 */
export interface IAdminDO {
  [ADMIN_DO]: AdminDO
}

/**
 * AdminDO class that provides plugin API access for Durable Objects
 */
export declare class AdminDO {
  constructor(ctx: DurableObjectState, env: any)

  /** Execute SQL query against the Durable Object's storage */
  execSql(query: string, ...bindings: any[]): any

  /** Get the current SQL storage size in bytes */
  sqlStorageSize(): number

  /** Check if this DO has AdminDO functionality */
  static hasAdminDO(obj: any): obj is IAdminDO
}
