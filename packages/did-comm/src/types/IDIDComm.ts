import {
  IAgentContext,
  IDIDManager,
  IKeyManager,
  IMessage,
  IMessageHandler,
  IPluginMethodMap,
  IResolver,
} from '@veramo/core'
import {
  IPackDIDCommMessageArgs,
  ISendDIDCommMessageArgs,
  ISendDIDCommMessageResult,
  ISendMessageDIDCommAlpha1Args,
  IUnpackDIDCommMessageArgs,
} from '../action-handler'
import { DIDCommMessageMediaType, IPackedDIDCommMessage, IUnpackedDIDCommMessage } from './message-types'

/**
 * DID Comm plugin interface for {@link @veramo/core#Agent}
 * @beta
 */
export interface IDIDComm extends IPluginMethodMap {
  /**
   * Partially decodes a possible DIDComm message string to determine the {@link DIDCommMessageMediaType}
   *
   * @param IPackedDIDCommMessage - the message to be interpreted
   * @returns the {@link DIDCommMessageMediaType} if it was successfully parsed
   * @throws if the message cannot be parsed as DIDComm v2
   *
   * @beta
   */
  getDIDCommMessageMediaType(args: IPackedDIDCommMessage): Promise<DIDCommMessageMediaType>

  /**
   * Packs a {@link IDIDCommMessage} using one of the {@link DIDCommMessagePacking} options.
   *
   * @param args - an {@link IPackDIDCommMessageArgs} object.
   *   * args.message - {@link IDIDCommMessage} - the message to be packed
   *   * args.packing - {@link DIDCommMessagePacking} - the packing method
   *   * args.keyRef - Optional - string - either an `id` of a {@link did-resolver#VerificationMethod}
   *     `kid` of a {@link @veramo/core#IKey} that will be used when `packing` is `jws` or `authcrypt`.
   *
   * @param context - This method requires an agent that also has {@link @veramo/core#IDIDManager},
   *   {@link @veramo/core#IKeyManager} and {@link @veramo/core#IResolver} plugins in use.
   *   When calling this method, the `context` is supplied automatically by the framework.
   *
   * @returns Promise\<\{message: string\}\> - a Promise that resolves to an object containing the serialized packed message
   *
   * @beta
   */
  packDIDCommMessage(
    args: IPackDIDCommMessageArgs,
    context: IAgentContext<IDIDManager & IKeyManager & IResolver>,
  ): Promise<IPackedDIDCommMessage>

  /**
   * Unpacks a possible DIDComm message and returns the {@link IDIDCommMessage} and
   * {@link DIDCommMessagePacking} used to pack it.
   *
   * @param args - an object containing the serialized message to be unpacked
   * @param context - This method requires an agent that also has {@link @veramo/core#IDIDManager},
   *   {@link @veramo/core#IKeyManager} and {@link @veramo/core#IResolver} plugins in use.
   *   When calling this method, the `context` is supplied automatically by the framework.
   *
   * @returns Promise<IUnpackedDIDCommMessage> - a Promise that resolves to an object containing
   *   the {@link IDIDCommMessage} and {@link DIDCommMessagePacking} used.
   *
   * @beta
   */
  unpackDIDCommMessage(
    args: IUnpackDIDCommMessageArgs,
    context: IAgentContext<IDIDManager & IKeyManager & IResolver>,
  ): Promise<IUnpackedDIDCommMessage>

  /**
   * TODO: add docs here
   *
   * @param args - TBD
   * @param context - TBD
   *
   * @returns TBD
   *
   * @beta
   */
  sendDIDCommMessage(
    args: ISendDIDCommMessageArgs,
    context: IAgentContext<IDIDManager & IKeyManager & IResolver & IMessageHandler>,
  ): Promise<ISendDIDCommMessageResult>

  /**
   *
   * @deprecated TBD - will be replaced by {@link DIDComm.sendDIDCommMessage}
   *
   * This is used to create a message according to the initial {@link https://github.com/decentralized-identifier/DIDComm-js | DIDComm-js} implementation.
   *
   * @remarks Be advised that this spec is still not final and that this protocol may need to change.
   *
   * @param args - Arguments necessary for sending a DIDComm message
   * @param context - This reserved param is automatically added and handled by the framework, *do not override*
   *
   * @beta
   */
  sendMessageDIDCommAlpha1(
    args: ISendMessageDIDCommAlpha1Args,
    context: IAgentContext<IDIDManager & IKeyManager & IResolver & IMessageHandler>,
  ): Promise<IMessage>
}
