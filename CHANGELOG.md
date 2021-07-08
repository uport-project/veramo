# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.2.2](https://github.com/uport-project/veramo/compare/v1.2.1...v1.2.2) (2021-05-18)


### Bug Fixes

* **cli:** print entire JSON tree resulting from DID resolution ([#524](https://github.com/uport-project/veramo/issues/524)) ([e83d33c](https://github.com/uport-project/veramo/commit/e83d33cc0687a100587a439bdc8b8ed1219b9c24)), closes [#523](https://github.com/uport-project/veramo/issues/523)





## [1.2.1](https://github.com/uport-project/veramo/compare/v1.2.0...v1.2.1) (2021-05-03)


### Bug Fixes

* integration tests and CLI config for did:key ([#498](https://github.com/uport-project/veramo/issues/498)) ([2ec0687](https://github.com/uport-project/veramo/commit/2ec068715d9fd4f2917c05f67755e226713cda1d))





# [1.2.0](https://github.com/uport-project/veramo/compare/v1.1.2...v1.2.0) (2021-04-27)


### Bug Fixes

* **ci:** explicitly publish to `latest` tag from `main` branch ([#494](https://github.com/uport-project/veramo/issues/494)) ([c7a3b98](https://github.com/uport-project/veramo/commit/c7a3b98eb6ea6a1c25d49928f3bd7beb02d07ad3))
* **deps:** update all non-major dependencies ([#462](https://github.com/uport-project/veramo/issues/462)) ([4a2b206](https://github.com/uport-project/veramo/commit/4a2b20633810b45a155bf2149cbff57d157bda3c))
* **deps:** update dependency inquirer to v8 ([#395](https://github.com/uport-project/veramo/issues/395)) ([96c2129](https://github.com/uport-project/veramo/commit/96c21295cbb7bddeb88711e77daadde77d4f1a4d))
* **deps:** update dependency multibase to v4 ([#396](https://github.com/uport-project/veramo/issues/396)) ([7ea7a8d](https://github.com/uport-project/veramo/commit/7ea7a8d38b36be82f8eb9f025783fd95e9b51508))
* **deps:** update dependency multicodec to v3 ([#398](https://github.com/uport-project/veramo/issues/398)) ([9e23a10](https://github.com/uport-project/veramo/commit/9e23a102506792d199fed5820a01290de2474392))
* **deps:** update dependency ngrok to v4 ([#433](https://github.com/uport-project/veramo/issues/433)) ([176e221](https://github.com/uport-project/veramo/commit/176e22144403ab3e2c885dc575394bae42d67a80))
* **deps:** update dependency openapi-types to v8 ([#446](https://github.com/uport-project/veramo/issues/446)) ([7ab3737](https://github.com/uport-project/veramo/commit/7ab3737094beaf1312336b2ed31764121d59ccf1))
* **deps:** update dependency ts-json-schema-generator to v0.90.0 ([d806ab5](https://github.com/uport-project/veramo/commit/d806ab5e7e934573796b84ec7adc54791b23efa5))
* **remote-server:** get alias for request ([#455](https://github.com/uport-project/veramo/issues/455)) ([6ef7e3a](https://github.com/uport-project/veramo/commit/6ef7e3a8b45e5b25961cdadfd6f4026372e9d73f))
* default CLI config OpenAPI schema ([#429](https://github.com/uport-project/veramo/issues/429)) ([c985d37](https://github.com/uport-project/veramo/commit/c985d37c63d5bfcc490f56ceead8c762c19142f0))
* open api schema x-methods ([#414](https://github.com/uport-project/veramo/issues/414)) ([faa7940](https://github.com/uport-project/veramo/commit/faa7940c515bbd65dfaf9370594794f627099a38))
* use URI encoded host in web-did-doc-router ([#384](https://github.com/uport-project/veramo/issues/384)) ([37186d5](https://github.com/uport-project/veramo/commit/37186d5cbdbbdbdccf0b6b9c56b1f78a482d1193)), closes [#383](https://github.com/uport-project/veramo/issues/383)
* **deps:** update dependency ts-json-schema-generator to v0.84.0 ([#369](https://github.com/uport-project/veramo/issues/369)) ([86ec9b3](https://github.com/uport-project/veramo/commit/86ec9b378248945cb364ec2224235359f3ac9d32))


### Features

* adapt to did core spec ([#430](https://github.com/uport-project/veramo/issues/430)) ([9712db0](https://github.com/uport-project/veramo/commit/9712db0eea1a3f48cf0665d66ae715ea0c23cd4a)), closes [#418](https://github.com/uport-project/veramo/issues/418) [#428](https://github.com/uport-project/veramo/issues/428) [#417](https://github.com/uport-project/veramo/issues/417) [#416](https://github.com/uport-project/veramo/issues/416) [#412](https://github.com/uport-project/veramo/issues/412) [#397](https://github.com/uport-project/veramo/issues/397) [#384](https://github.com/uport-project/veramo/issues/384) [#394](https://github.com/uport-project/veramo/issues/394)
* add MemoryDIDStore and MemoryKeyStore ([#447](https://github.com/uport-project/veramo/issues/447)) ([5ab1792](https://github.com/uport-project/veramo/commit/5ab1792f080cc319a9899e39dc9b634a05aa4f7c))
* add native resolver for did:key ([#458](https://github.com/uport-project/veramo/issues/458)) ([a026f24](https://github.com/uport-project/veramo/commit/a026f247ad91dcb3a996e0e95b0fe253cf538f8b)), closes [#352](https://github.com/uport-project/veramo/issues/352)
* add option to keep payload fields when creating JWT VC/VP ([#431](https://github.com/uport-project/veramo/issues/431)) ([43923e1](https://github.com/uport-project/veramo/commit/43923e18b8e0b68c4552489d568ab16748156970)), closes [#394](https://github.com/uport-project/veramo/issues/394)
* **core:** add ability to define the agent context type ([#350](https://github.com/uport-project/veramo/issues/350)) ([89255b9](https://github.com/uport-project/veramo/commit/89255b9a648c38656aea05131750e68497d04c27))
* **did-provider-key:** add did:key provider; fixes [#335](https://github.com/uport-project/veramo/issues/335) ([#351](https://github.com/uport-project/veramo/issues/351)) ([42cd2b0](https://github.com/uport-project/veramo/commit/42cd2b08a2fd21b5b5d7bdfa57dd00ccc7184dc7)), closes [decentralized-identity/did-jwt#78](https://github.com/decentralized-identity/did-jwt/issues/78)
* **url-handler:** allow for URL redirects ([#362](https://github.com/uport-project/veramo/issues/362)) ([#366](https://github.com/uport-project/veramo/issues/366)) ([92a86d6](https://github.com/uport-project/veramo/commit/92a86d6f8cf652e731ca662085efe78aeab198eb))





## [1.1.2](https://github.com/uport-project/veramo/compare/v1.1.1...v1.1.2) (2021-04-26)


### Bug Fixes

* add names to TypeORM entities ([#480](https://github.com/uport-project/veramo/issues/480)) ([750bfcf](https://github.com/uport-project/veramo/commit/750bfcf825b3d18080f7bf308b3a33a4da71a5eb))





## [1.1.1](https://github.com/uport-project/veramo/compare/v1.1.0...v1.1.1) (2021-03-09)


### Bug Fixes

* **cli:** validate config file version number ([#413](https://github.com/uport-project/veramo/issues/413)) ([fb5668c](https://github.com/uport-project/veramo/commit/fb5668cb95cee2b26bb06e55b20d0007f57a6a02))





# [1.1.0](https://github.com/uport-project/veramo/compare/v1.0.1...v1.1.0) (2021-01-26)


### Bug Fixes

* make privateKey property of Key entity nullable ([#342](https://github.com/uport-project/veramo/issues/342)) ([aa48ed9](https://github.com/uport-project/veramo/commit/aa48ed9930395c66aa8f952b8545c9b918e303ae))
* **deps:** update dependency commander to v7 ([#330](https://github.com/uport-project/veramo/issues/330)) ([f8a7566](https://github.com/uport-project/veramo/commit/f8a75665f02bbee74c89554a67588a6a33968d85))
* **deps:** update dependency z-schema to v5 ([#323](https://github.com/uport-project/veramo/issues/323)) ([9cadf37](https://github.com/uport-project/veramo/commit/9cadf378dba487b1a664a6277eafffd629c65600))


### Features

* **core:** make agent context public readonly ([#347](https://github.com/uport-project/veramo/issues/347)) ([802948e](https://github.com/uport-project/veramo/commit/802948ea72edf8b00c42115f73430720debabed9))





## 1.0.1 (2020-12-18)


### Bug Fixes

* **core:** Improve identity lookup speed ([#230](https://github.com/uport-project/veramo/issues/230)) ([b2f6332](https://github.com/uport-project/veramo/commit/b2f6332d5b4e6e62235a796fdc43170d58cae63b)), closes [#229](https://github.com/uport-project/veramo/issues/229)
* **daf-resolver:** import cross-fetch in universal-resolver.ts ([#303](https://github.com/uport-project/veramo/issues/303)) ([57be4ea](https://github.com/uport-project/veramo/commit/57be4ea5d1c1ad5dc9598c035432c4ad874bc44b)), closes [#302](https://github.com/uport-project/veramo/issues/302)
* OpenAPI name, version and x-methods ([#301](https://github.com/uport-project/veramo/issues/301)) ([cbad7c0](https://github.com/uport-project/veramo/commit/cbad7c0558f4ba515cad995374a4e11d2afdc2e0))
* **daf-did-jwt:** Fix parsing of JWT with missing `typ` in header ([#293](https://github.com/uport-project/veramo/issues/293)) ([48e4c60](https://github.com/uport-project/veramo/commit/48e4c607f78ac19be2ba83291cb68f414edb5b6b)), closes [#291](https://github.com/uport-project/veramo/issues/291)
* **daf-did-jwt:** Fix verification of EdDSA JWTs ([#289](https://github.com/uport-project/veramo/issues/289)) ([b97f2a3](https://github.com/uport-project/veramo/commit/b97f2a3bc6bfc5f9df143e7e79840e568d6a9606)), closes [#288](https://github.com/uport-project/veramo/issues/288)
* **daf-express:** Fix behavior of CLI HTTPS server behind proxy ([#292](https://github.com/uport-project/veramo/issues/292)) ([3c39484](https://github.com/uport-project/veramo/commit/3c394844236fe78d7d9499c35861345dcff5212a))
* **daf-resolver:** Fixed daf-resolver configuration ([#298](https://github.com/uport-project/veramo/issues/298)) ([dfcf32a](https://github.com/uport-project/veramo/commit/dfcf32a88bfe8353270a567d40bcfab25ddbffe9)), closes [#205](https://github.com/uport-project/veramo/issues/205)
* **message-handler:** Rewire promise rejections as `Error` objects ([#300](https://github.com/uport-project/veramo/issues/300)) ([04446d4](https://github.com/uport-project/veramo/commit/04446d4e2d2dba8ff2ae5695014686ef49891804)), closes [#294](https://github.com/uport-project/veramo/issues/294)
* Add replyTo & replyUrl to message ([c6cbd30](https://github.com/uport-project/veramo/commit/c6cbd30e74820f4c9d37c0d333ca9cfff4783b89))
* Allow empty issuers in sdr credential request ([453a51c](https://github.com/uport-project/veramo/commit/453a51ca0d9e01893eab014ce70f42c2e17afa9d))
* allow to pass in a custom registry address ([c785167](https://github.com/uport-project/veramo/commit/c785167f6b3bf6b51325e431fba80c242204f590)), closes [/github.com/decentralized-identity/ethr-did-resolver/blob/develop/src/ethr-did-resolver.js#L187](https://github.com//github.com/decentralized-identity/ethr-did-resolver/blob/develop/src/ethr-did-resolver.js/issues/L187)
* Another missing await ([b924f92](https://github.com/uport-project/veramo/commit/b924f925ad47810aaa43876cef0d49a42e6d126f))
* babel running out of memory when running jest ([92e285e](https://github.com/uport-project/veramo/commit/92e285e184f56e3ca9441ecbcdc6b287727cb4f9))
* Big value handling ([#167](https://github.com/uport-project/veramo/issues/167)) ([39a76b6](https://github.com/uport-project/veramo/commit/39a76b60ecc085d7ce0c476b0b20e166b415d408))
* Changing some copy in CLI ([ed2c044](https://github.com/uport-project/veramo/commit/ed2c0447a6973d55a3be8bfa4acb9439ff7c83c9))
* Checking if credentialSubject is array ([2f83192](https://github.com/uport-project/veramo/commit/2f83192a47b39369fd1ccad3b0f4a3c70dd4a893))
* Claim value nullable ([4cb85b2](https://github.com/uport-project/veramo/commit/4cb85b2aa677eab5c39011f0e32bb7ebc86d7b84))
* CLI ([86b6f9e](https://github.com/uport-project/veramo/commit/86b6f9e7a97ce29cbdffaf167dd568c66996c0ff))
* CLI graphql typeDefs and resolvers ([88626d3](https://github.com/uport-project/veramo/commit/88626d37621929b3383fdef5849dbea795fbe053))
* CLI sdr flow ([f630b76](https://github.com/uport-project/veramo/commit/f630b76cda60d6a0b16d51eb779dfd533bd30756))
* CLI SDR flow ([eb31f43](https://github.com/uport-project/veramo/commit/eb31f434a2cbb7571e8f4d5b6667f08373dfaff2))
* CLI sqlite and pg deps ([31fc85a](https://github.com/uport-project/veramo/commit/31fc85a16c8edc098fac13c0a96faad151fda208))
* Create identities from required issuers to resolve gql queries ([b93d7ad](https://github.com/uport-project/veramo/commit/b93d7adf001e71dbf92164cbd4c44e15f939bed2))
* Creating VC ([f8caa6a](https://github.com/uport-project/veramo/commit/f8caa6a859fdf6838daa489e9f30d74154b41dc7))
* Credential id type ([39d8d18](https://github.com/uport-project/veramo/commit/39d8d18ce7c87db179a4fcb73fc333c544ce841f))
* CredentialStatus field type ([40e97a6](https://github.com/uport-project/veramo/commit/40e97a6e6daeb8357332456967799a18434bfbaf))
* Daf REST headers type ([b22c540](https://github.com/uport-project/veramo/commit/b22c540d20a459ad1b00979be2bd82be90aeb3a4))
* Daf-elem-did missing peer deps ([747b8f9](https://github.com/uport-project/veramo/commit/747b8f9fb4ec52e82cde519adaae92bc7bd46a0a))
* Daf-libsodium debug ([babbfe6](https://github.com/uport-project/veramo/commit/babbfe63b51f4b6430d0dcd75ca2a2e599c184af))
* Daf-rest overrides ([0d6c031](https://github.com/uport-project/veramo/commit/0d6c031df77a4c0f0dd3649e3303998323f4bde5))
* DataStoreORM claim subject ([e332dcc](https://github.com/uport-project/veramo/commit/e332dcc2bfa261bc43a2c4e2a7ab2bbf13b647df))
* DataStoreORM interface ([719959a](https://github.com/uport-project/veramo/commit/719959a59ac8877523f36254da71609fd5e222eb))
* DataStoreORM messagesQuery ([be2badb](https://github.com/uport-project/veramo/commit/be2badbe359e7a5c470f50472d022a87bd3d4c2b))
* DataStoreORM saving claims ([281b493](https://github.com/uport-project/veramo/commit/281b493374ca3d981a828207f14190dcb95c93a6))
* DB migrations ([14b578e](https://github.com/uport-project/veramo/commit/14b578e87740cd3d19e5ae728791a192cc50bc4c))
* Deps for daf-rest ([564f2ba](https://github.com/uport-project/veramo/commit/564f2ba4909636c25cb827706608bcc65b7b54e4))
* Disable schema validation by default ([#278](https://github.com/uport-project/veramo/issues/278)) ([7bb77cd](https://github.com/uport-project/veramo/commit/7bb77cde56415e8e909cabc235c62188d8147d0e)), closes [#255](https://github.com/uport-project/veramo/issues/255) [#275](https://github.com/uport-project/veramo/issues/275)
* Disable schemaValidation in CLI default config ([#280](https://github.com/uport-project/veramo/issues/280)) ([8785a5b](https://github.com/uport-project/veramo/commit/8785a5b0193adae6738c23a49eda64c7b2a2a335)), closes [#278](https://github.com/uport-project/veramo/issues/278) [#275](https://github.com/uport-project/veramo/issues/275) [#255](https://github.com/uport-project/veramo/issues/255)
* Ethr-did debug ([688595f](https://github.com/uport-project/veramo/commit/688595f0dc6f1ec7e06f82a7e33aebe13263c66b))
* Example queries ([5933e50](https://github.com/uport-project/veramo/commit/5933e5003964935d0e1d39c273b2fe38a639ce1b))
* Expiration Date ([c7212f9](https://github.com/uport-project/veramo/commit/c7212f97cee76dcb83ee748e934abb4b793b4640))
* export context ([99fd267](https://github.com/uport-project/veramo/commit/99fd267c70946e24df5dd8b42f8345aadc9366c2))
* export context ([f6265f9](https://github.com/uport-project/veramo/commit/f6265f9a3b78b3c9ad10ade4e3bd96cc37d1d9d6))
* Failing CI ([1264b99](https://github.com/uport-project/veramo/commit/1264b99766d5b062f19e99326ed7cc1f5f19de89))
* Failing CI ([53b114e](https://github.com/uport-project/veramo/commit/53b114e2f0dbb9414317f64af59b15654827e792))
* Failing CI ([f910731](https://github.com/uport-project/veramo/commit/f910731180b64d1c666cf46bcaa1107f60eb5813))
* Failing CI ([3f31953](https://github.com/uport-project/veramo/commit/3f3195376a54a4dfd605eea521b0beac8de0e160))
* fixes failing audience query tests ([40408dc](https://github.com/uport-project/veramo/commit/40408dce03a3c23dff07c89f2455d89c60893ebf))
* Fixing replyTo types ([bd9d606](https://github.com/uport-project/veramo/commit/bd9d606890060e27b5d236b58e7f404c2c36d613))
* Generating message.id if not set ([5ce04e5](https://github.com/uport-project/veramo/commit/5ce04e5f8ebbba4368b84dffc563696d79a8fee2))
* Generating message.id if not set ([fabf5f6](https://github.com/uport-project/veramo/commit/fabf5f64b9f0733a3a533d037203527f26758106))
* GetIdentityProviders ([d1bdbc2](https://github.com/uport-project/veramo/commit/d1bdbc2cac03012b5573eaf2b531c2b707f5e5e5))
* GraphQL orderBy ([bb06094](https://github.com/uport-project/veramo/commit/bb060941fab367540d1fd8cdbc4ad6de51fb00ab))
* handle jwt messages correctly in daf-url in browser environments ([db26132](https://github.com/uport-project/veramo/commit/db261325a606b0077cc333600b844101be1cd009))
* IdentityController for web-did ([a829991](https://github.com/uport-project/veramo/commit/a829991f0d16b424e756684cbca8d159b8195cac))
* IdentityManager ([1f2da11](https://github.com/uport-project/veramo/commit/1f2da1150d4895db3f21711bb1d11f619961a321))
* IdentityManager ([32a1c03](https://github.com/uport-project/veramo/commit/32a1c0335bb66b6055efe851c2e2ac72348b54a3))
* IdentityProvider WIP ([feec69e](https://github.com/uport-project/veramo/commit/feec69e49f1760884b263feee63fc3e2d833c7e5))
* IdentityStore ([53eb972](https://github.com/uport-project/veramo/commit/53eb9721f2a64d231955a555dc2465adb2c8c668))
* IdentityStore saving services ([9a35ee9](https://github.com/uport-project/veramo/commit/9a35ee9e7a5866c106961c0f1cc4dc2fd1fad0c3))
* IHandleMessage interface ([0ab68fd](https://github.com/uport-project/veramo/commit/0ab68fd945e719dc375757650c52752bba3338a7))
* IIdentityManager interface ([b6d1e36](https://github.com/uport-project/veramo/commit/b6d1e36252b74c9decd95a46bb371df092fa6479))
* IKeyManager arg types ([f79967e](https://github.com/uport-project/veramo/commit/f79967e1d9fbed7abbd1648d3f1f259c8f3cd92e))
* Import DID support for daf-react-native-libsodium ([#257](https://github.com/uport-project/veramo/issues/257)) ([e290482](https://github.com/uport-project/veramo/commit/e290482ec342ecbce1fe48b39082c128e073be23))
* JSON schema for W3CCredential ([#287](https://github.com/uport-project/veramo/issues/287)) ([543615f](https://github.com/uport-project/veramo/commit/543615f33eecb2aa7472e9f3a63514392d12a4e0))
* JWT verification with multiple audiences ([dbbb85f](https://github.com/uport-project/veramo/commit/dbbb85f4261ac0d1a0f8080fcb734c66eb311696))
* Keeping app specific payload fields ([24ad82a](https://github.com/uport-project/veramo/commit/24ad82a9abd1e1a5c3cef91efea7a17637b958c3))
* KeyManagerSignEthTX ([c936a00](https://github.com/uport-project/veramo/commit/c936a001a270086378e26cf7fa5054dbc8d7d94e))
* Local copy of W3C types ([29c6b0e](https://github.com/uport-project/veramo/commit/29c6b0efc37f181d40aff560d4d481eb84e0ea9a))
* Message handler chain ([58b0629](https://github.com/uport-project/veramo/commit/58b062921e02ca4160b1a90efa56e1c5c89ba8bb))
* MessageHandler ([21a78e3](https://github.com/uport-project/veramo/commit/21a78e3a16257d2c9d956acfc46576955688aed4))
* MessageHandler chain ([198a33a](https://github.com/uport-project/veramo/commit/198a33a0000181ba83be1c9848f035e1a69c2cd1))
* Missing await ([9c36f84](https://github.com/uport-project/veramo/commit/9c36f8415f27c91824af97bbc6e2415aba9c5feb))
* Missing dependency ([773dbb2](https://github.com/uport-project/veramo/commit/773dbb2c890428157ae4c7218b7e29e0853d738c))
* OpenAPI schema ([2ef0bc7](https://github.com/uport-project/veramo/commit/2ef0bc7ae4a425e29eae4aaad982048314c9ca14))
* OpenAPI types dep for daf-rest ([63e7565](https://github.com/uport-project/veramo/commit/63e7565d3e2d02e8a170effa67838b9a25c13e22))
* Optional dependency of daf-elem-did ([8c733b8](https://github.com/uport-project/veramo/commit/8c733b8e06e0ef0a379fa43a534733e37063834b))
* Pass ethr-did registry param down to the identity controller ([a0a2a98](https://github.com/uport-project/veramo/commit/a0a2a98600f6a0c22105e5f9d7ab2a8d174d57c2))
* Plugin schemas ([1fedaa5](https://github.com/uport-project/veramo/commit/1fedaa5ed378be30cdcd76a8d241444bd2306af7))
* React example SDR ([b741e72](https://github.com/uport-project/veramo/commit/b741e72af01cda04202f67bb570d546b0ca029e9))
* React-graphql using new api ([fe53366](https://github.com/uport-project/veramo/commit/fe533669de3ff882a9c23357ba2eed35e432d493))
* Remove daf-data-store from packages ([f3bc819](https://github.com/uport-project/veramo/commit/f3bc8192ff7f5418544ea44a8d4d86bff7b8fd1e))
* Remove dup ([82629e1](https://github.com/uport-project/veramo/commit/82629e13d49385cf7dfb562c7cc9bbe21cfd210c))
* Remove postinstall ([2577983](https://github.com/uport-project/veramo/commit/257798312edaf4817f906f714e0527bf7c112bc8))
* Remove postinstall ([9fad446](https://github.com/uport-project/veramo/commit/9fad4468fcedd567cf0e2dd06b319d50cd10a9a0))
* Remove static Credential.credentialStatus ([f9a06af](https://github.com/uport-project/veramo/commit/f9a06afcd01fc9e0452535d10d32158414490ea4))
* Remove static Credential.credentialStatus ([719fddc](https://github.com/uport-project/veramo/commit/719fddc558dd7ec2925e3a8d695a5de4c65e91cd))
* Removing daf-data-store from examples ([7c74e18](https://github.com/uport-project/veramo/commit/7c74e184df6f5d2c1d0872b9db86da51365b5e47))
* Removing EcdsaSignature type ([3e3a684](https://github.com/uport-project/veramo/commit/3e3a6843a77cf389be9aa6414a2f77ebe26adc62))
* Removing uuid from id ([df12094](https://github.com/uport-project/veramo/commit/df1209461b4b197b5f19c9d5bf4a71caf0c57f7d))
* Resolver debug info ([5a32a63](https://github.com/uport-project/veramo/commit/5a32a630884486934530cdb31b3cf8fb887a44da))
* Resolver tests ([65b3ff0](https://github.com/uport-project/veramo/commit/65b3ff0cb46fdd5913bdca31c31726c2fa9bbe14))
* resolvers and handlers didn't match schema ([85c38a2](https://github.com/uport-project/veramo/commit/85c38a206a163e3ed601b1ad2ac330f275d7ac4a))
* Rest client error handling ([b871a39](https://github.com/uport-project/veramo/commit/b871a39fd46930871c6695a4f9e7aa66b886f617))
* Saving DIDComm message ([7d0201e](https://github.com/uport-project/veramo/commit/7d0201ec584371a6257b651beffbad7776fe5d5c))
* SDR GQL reason ([ae23c88](https://github.com/uport-project/veramo/commit/ae23c8886b59d07f5891d4c2973abfc90f069e3b))
* Sdr helper function types ([602a672](https://github.com/uport-project/veramo/commit/602a672ad81d6a9c728dc0968c04847710a181f9))
* SDR message handler replyTo ([f04920f](https://github.com/uport-project/veramo/commit/f04920fcc7e19839b39038f155d2941fc7163567))
* SDR only for sdr message type ([b77c5c7](https://github.com/uport-project/veramo/commit/b77c5c740ac96a2bb5fb2ca17348f0ffdedc5d9a))
* Setting credentialSubject last ([b832b7c](https://github.com/uport-project/veramo/commit/b832b7c0ffcc3c095d2122fce3287328000faefd))
* TAgent definition ([ce1af94](https://github.com/uport-project/veramo/commit/ce1af94c639b4b98ad54212608d850d2a1833580))
* Test daf-did-jwt ([d6383c7](https://github.com/uport-project/veramo/commit/d6383c739d40edb55055b13ea9e931b440b629e4))
* Test daf-url ([12e2c1e](https://github.com/uport-project/veramo/commit/12e2c1e12f450bc2e2ec4240ef037ba1d7de2f74))
* Throwing errors for non existing entities ([a48e7ef](https://github.com/uport-project/veramo/commit/a48e7ef0afe4e44070a85867eb86bf039a7ae3c8))
* Translating issuanceDate to nbf ([51f0eff](https://github.com/uport-project/veramo/commit/51f0effa5f911a9432f6d6880d2b23915875001d))
* Type error and CORS error in react-app example ([#258](https://github.com/uport-project/veramo/issues/258)) ([9f7dac4](https://github.com/uport-project/veramo/commit/9f7dac46d8ed247974778df37b7cf6c9f28a6193))
* Types ([c35e452](https://github.com/uport-project/veramo/commit/c35e452679ce86378d6a37e6dbace855d8583b84))
* Types for IW3c ([56cf141](https://github.com/uport-project/veramo/commit/56cf1412e9811f0fec675d9210e82614a6b15ea0))
* Uniresolver config ([8dbdae1](https://github.com/uport-project/veramo/commit/8dbdae10a623de7ab5304a62075ebfc9f7572b97))
* Updated examples: pass dbConnection to Agent ([d84872d](https://github.com/uport-project/veramo/commit/d84872d70a5f422b5f6d6eca3db3236d5e671661))
* Use baseUrl in CLI server ([7b18ac6](https://github.com/uport-project/veramo/commit/7b18ac61559e56ee260e3073a8fcc67d3065f243))
* Use the first audience did for message.to ([c71eec7](https://github.com/uport-project/veramo/commit/c71eec784526b44f22d76307ac0e83b0e125d965))
* Using cross-fetch in did-comm ([2a931ff](https://github.com/uport-project/veramo/commit/2a931ff46666ca66da2544266cb0ad0a12e2dada))
* Valid OpenApi v3 schema ([32175c3](https://github.com/uport-project/veramo/commit/32175c340df69aea0d8fa91f6d962523fbe2dac4))
* Version takes only two parameters ([5951fe4](https://github.com/uport-project/veramo/commit/5951fe416186d295ccd9fc10aa17f75f47e5bbf0))
* W3c message createdAt ([59656f8](https://github.com/uport-project/veramo/commit/59656f8d1aee9479f195dd949712032b75c1dd04))
* W3c tests ([2bc4084](https://github.com/uport-project/veramo/commit/2bc40847e61786b981a6c61afdb66213beaa8496))
* **deps:** enable verification of ES256K signatures with default did:ethr: docs ([2e1bd33](https://github.com/uport-project/veramo/commit/2e1bd331c3fc054f86380d977a78ec2305029a8e))
*  Adding sub in sdr gql ([45bb8bf](https://github.com/uport-project/veramo/commit/45bb8bfe0d8ea270e08a0578a8d995d4e04b21c2))
* Adding id to serviceMessagesSince ([45bb45b](https://github.com/uport-project/veramo/commit/45bb45b8b59034e6f793d486e06efc998c53584e))
* Adding profileImage ([1063057](https://github.com/uport-project/veramo/commit/1063057a65078f57a9e9493ef2ef4f76f13d177e))
* Adding tag in VP ([c154015](https://github.com/uport-project/veramo/commit/c154015de13a420a685f2115817bef2774a3cb9d))
* Adding tag to vc/vp ([3c876a9](https://github.com/uport-project/veramo/commit/3c876a9993c4bb48af2c289a095d4a6144a34f12))
* Allow version changes ([3096edb](https://github.com/uport-project/veramo/commit/3096edb9b1e7900925e91ca56e051c7d6154ee6c))
* Await crypto_sign_keypair ([c97ba6b](https://github.com/uport-project/veramo/commit/c97ba6be2bed9644e81b58cd164f012abdde4a16))
* Await in IdentityProvider and KMS ([a5b36d9](https://github.com/uport-project/veramo/commit/a5b36d9b96cc1ee6a2e0c1cb95f4697c39b1586b))
* Await in listDids ([94c759c](https://github.com/uport-project/veramo/commit/94c759c10d4a022fb081472058782766792dfecc))
* Bug in findCredentialsByFields ([e9f263a](https://github.com/uport-project/veramo/commit/e9f263a45a6b121aef4729bdb45a1be39b753af6))
* Building ([60f3777](https://github.com/uport-project/veramo/commit/60f3777510514051e75822ae8f350e28e1f64e54))
* Catching edge case ([3c1a935](https://github.com/uport-project/veramo/commit/3c1a9357b36c51f6ee586726008e7e5c00a177d4))
* Check if file exists ([89f604f](https://github.com/uport-project/veramo/commit/89f604f3243cdae39848827484967be00ff9a4d7))
* Claim hash ([d00b9c6](https://github.com/uport-project/veramo/commit/d00b9c6ed1fed1c76cb7ed4939e2f017979360a2))
* CLI defaultPath ([20b70d9](https://github.com/uport-project/veramo/commit/20b70d92d464540a1af938b1a45df3b6d39a733f))
* Cli VP ([3db8186](https://github.com/uport-project/veramo/commit/3db8186a1d6bbaa9726a8de3499055f872d41380))
* CLI VP type is VerifiablePresentation ([1558555](https://github.com/uport-project/veramo/commit/1558555252366aa126fde1fe9ecf161de613d72d))
* Copy ([9cbff8a](https://github.com/uport-project/veramo/commit/9cbff8a47022a2dc3378ff2f2df78a2f0e0656af))
* Corrected dependency ([5c0768e](https://github.com/uport-project/veramo/commit/5c0768e1086e01563d923eb5718b45d9e6eb24c7))
* Credential creation ([7ddac1f](https://github.com/uport-project/veramo/commit/7ddac1f3fe602b1b9de1302f67b55c205f6c688a))
* Data store await for meta data ([5d96401](https://github.com/uport-project/veramo/commit/5d96401530025b76007669e7d28a394378a4fbe9))
* Debug info ([b49cac9](https://github.com/uport-project/veramo/commit/b49cac9d26f86904cadde231ec4ad50e3bfa1129))
* Debug info in daf-node-sqlite3 ([b0b5b70](https://github.com/uport-project/veramo/commit/b0b5b704bc8ceda994c9ca4b1e369b28192c1af1))
* Decoding base64 keys ([04bb839](https://github.com/uport-project/veramo/commit/04bb8392d7b842992f8d65fb826dfbd9188f0ff9))
* Decrypting ([db07fdb](https://github.com/uport-project/veramo/commit/db07fdbfb2c45e5d169b54f1ca5a1825b610f250))
* Deduplicating messages ([eda582b](https://github.com/uport-project/veramo/commit/eda582b32923d6cd251fc82023dc18b361122c5e))
* Default TGE with WebSocket support ([23ebcea](https://github.com/uport-project/veramo/commit/23ebcea0fbc3aa39410b538cb3a08e89916e2232))
* Dependencies ([531a51f](https://github.com/uport-project/veramo/commit/531a51fa741b3464210059f85d1b543bb3fe07a9))
* Deps ([0d29fbb](https://github.com/uport-project/veramo/commit/0d29fbb2f3a72fc80b8353c3584831ddb2958541))
* Deps ([a230eba](https://github.com/uport-project/veramo/commit/a230ebac52b7916ebe75b27ef1c37694e0f601c7))
* Eager relations ([da07cb2](https://github.com/uport-project/veramo/commit/da07cb21f1bcb6da7a742f28f8a4e3c9dc8ad1ba))
* Eager relations ([9938384](https://github.com/uport-project/veramo/commit/993838438299cf3d5d71b6d59780bcdb0b4d351e))
* Ethr-did identity provider web3Provider ([a5d6af2](https://github.com/uport-project/veramo/commit/a5d6af2032130a7eff1722bc47b758a824906be6))
* Ethr-did toEthereumAddress ([7335390](https://github.com/uport-project/veramo/commit/733539014eb4104bb8a4f82b42fef92cc7f0c067))
* Ethr-did TTL = 1 year ([fa6b6c5](https://github.com/uport-project/veramo/commit/fa6b6c59dc2caa189fa5675dcf86139945376af9))
* EventEmmiter ([dc52b55](https://github.com/uport-project/veramo/commit/dc52b55aad6c612266ce136636f6aa65e524b59b))
* Example ([dcf46d6](https://github.com/uport-project/veramo/commit/dcf46d66a9ff1cc7712b0984843db4c0984ae972))
* Example deps ([fc01968](https://github.com/uport-project/veramo/commit/fc019680a0a00ce0c3d5608f651e245496ce8a69))
* Examples ([9887732](https://github.com/uport-project/veramo/commit/988773235ffc6967761c54205a7cc412037fa255))
* Examples ([e4581e1](https://github.com/uport-project/veramo/commit/e4581e148ee1fdf19efd4f3506a6eb8e2a6789f9))
* Express example ([1c33310](https://github.com/uport-project/veramo/commit/1c333108accc7feaaaba5a7864db12efac626881))
* Fetching credentials for SDR ([e91668e](https://github.com/uport-project/veramo/commit/e91668e664fca7d9826fd45e179cafe1b3cbe975))
* Find Messages ([5234c54](https://github.com/uport-project/veramo/commit/5234c541257271010ebf3e70bb620e3fcc02ff14))
* Fix credential select ([6c5f9e9](https://github.com/uport-project/veramo/commit/6c5f9e97d4ad7d61ec8dab257ec2a1c5a9166f24))
* Fix multi query wrapper component ([e2b5056](https://github.com/uport-project/veramo/commit/e2b5056027dc3b4ec439b4be5fbb86d794349515))
* Fix rendering route sidepanels ([7c10ce9](https://github.com/uport-project/veramo/commit/7c10ce9921734b042c36a62af0fd646cde605f26))
* GQL export ([63b9c23](https://github.com/uport-project/veramo/commit/63b9c23e21e297347e8b24e1ed0cfdb6bd8d5524))
* GQL export ([eacc969](https://github.com/uport-project/veramo/commit/eacc9697e87bbf6a91db8d9bd5195aea096a13c4))
* GQL newMessage data field ([48181b9](https://github.com/uport-project/veramo/commit/48181b93a5504e82373894598a81149f3c529a69))
* GQL return raw while validating message ([53573bc](https://github.com/uport-project/veramo/commit/53573bc07cbaabc92c34baaa3096acd279aa985f))
* Handle raw message in cli ([53ffa0d](https://github.com/uport-project/veramo/commit/53ffa0d41bc453ce471be81999b93d98fbf16baa))
* Hiding explore item ([14211c5](https://github.com/uport-project/veramo/commit/14211c57a55a49440ae8bcb1a707d7d8db7f9b6b))
* Id-hub example ([7198e23](https://github.com/uport-project/veramo/commit/7198e23b6878654f91c1c0aaa9654743bf853dda))
* Identity.isManaged ([38ad11e](https://github.com/uport-project/veramo/commit/38ad11ec9abf74143acda726725820c0d6e29e14))
* IdentityStore provider ([88cdd5a](https://github.com/uport-project/veramo/commit/88cdd5a02ff01dd7a1b4665fefffa062c1c431f4))
* Initializing DB before any action ([7b5959e](https://github.com/uport-project/veramo/commit/7b5959e9ea8c4e5a93e8aeeb98baf020c0388a9c))
* IssuanceDate  is mandatory ([38edef6](https://github.com/uport-project/veramo/commit/38edef62201aad6b2efdc9ce5b6e7597f0aa1652))
* Latest message timestamps ([048974b](https://github.com/uport-project/veramo/commit/048974b7016a1deb990aacf2b84a09a172bd3f6d))
* Loading URLs that have a hostname ([2e65531](https://github.com/uport-project/veramo/commit/2e655319314ec2aaaef5ef1a9263eb8ee556ece8))
* Message sub can be null ([6599296](https://github.com/uport-project/veramo/commit/6599296b2560fddbd63aaa4b45bb920e3fcd0b41))
* Mixup with pk and sk ([e9b912f](https://github.com/uport-project/veramo/commit/e9b912f8e8172ff621afd4e4d0f1a087aa19ac93))
* Moved did-resolver to devDeps ([3ae8c1c](https://github.com/uport-project/veramo/commit/3ae8c1cec0c0d0b827d627cc181a85935fae2e88))
* Moving dependency ([3296b23](https://github.com/uport-project/veramo/commit/3296b23f4236f947d8c9b56c4c129c519cb5daac))
* NewMessage mutation ([3c9428e](https://github.com/uport-project/veramo/commit/3c9428e8e40f9702271aceee8dca4393d0ca7515))
* Ordering in latestMessageTimestamps ([fca9995](https://github.com/uport-project/veramo/commit/fca9995f1fd9c1fa09ba024f8d0eeb417d97b9ee))
* React native deps ([bda41bc](https://github.com/uport-project/veramo/commit/bda41bcadaef91cce61f753d07639323c80d34fb))
* React native peerDependencies ([a18482b](https://github.com/uport-project/veramo/commit/a18482bda54385f67772f60e3ac37a8ee75e096a))
* Readme ([7b598cb](https://github.com/uport-project/veramo/commit/7b598cb398fd2ea001b0ae07c958ed7274df085e))
* Readme ([385739c](https://github.com/uport-project/veramo/commit/385739c67da2b18b0b9b0907b51572617264e335))
* Referenced project ([801d2c6](https://github.com/uport-project/veramo/commit/801d2c6e89062f00737379e629009a8454084350))
* Remove auto ci beta release ([936b7d1](https://github.com/uport-project/veramo/commit/936b7d13ac145491a2de692eefb57a088d339313))
* Remove debug info ([a7753dd](https://github.com/uport-project/veramo/commit/a7753ddb1875f5c7d02d1ad4f24b21f4963df338))
* Remove duplicate JWTs from VP Fixes [#48](https://github.com/uport-project/veramo/issues/48) ([f24ffea](https://github.com/uport-project/veramo/commit/f24ffea078908a394181bb92b93331287c01381d))
* Remove unused ws ([55e0fcb](https://github.com/uport-project/veramo/commit/55e0fcb1a68e86c7003909fb03f92ee1b357026c)), closes [#91](https://github.com/uport-project/veramo/issues/91)
* Removing action handler ([4371bcd](https://github.com/uport-project/veramo/commit/4371bcd577d8c7a2f03ad88b6d18165e04881ea1))
* Removing context entities ([1a5c4c9](https://github.com/uport-project/veramo/commit/1a5c4c9827fdc98338395311d7b176ebd09332f3))
* Removing daf-sodium-fs and encryptionmanager ([1ea064d](https://github.com/uport-project/veramo/commit/1ea064dabf8d7875c060411283d2d80c04d9c801))
* Removing dependency ([af5c76a](https://github.com/uport-project/veramo/commit/af5c76a3fe1d583d014fb8f1f7ff5f3f4a3f7dfa))
* Removing dependency ([4318e80](https://github.com/uport-project/veramo/commit/4318e8020645dd4858c8f895880d94659557acba))
* Removing deps ([8db9286](https://github.com/uport-project/veramo/commit/8db9286b94ac7060035ab75552e2646820326b70))
* Removing DIDComm-js ([94f8975](https://github.com/uport-project/veramo/commit/94f8975f50a577a284a1c0076033b0b5fc1ee6d0))
* Removing duplicate saveMessage ([ab2c6a0](https://github.com/uport-project/veramo/commit/ab2c6a091e79af4f2d62e3a566bf8fc0059261a6))
* Removing encryption key manager ([65ba8a2](https://github.com/uport-project/veramo/commit/65ba8a212bedd64215cb96c0bf8a6c2245bd5cb0))
* Removing gql from web-demo ([c3676f0](https://github.com/uport-project/veramo/commit/c3676f0e3913f292b077a4bfaed6d0c70fb5a742))
* Removing MessageMetaData entity ([353449c](https://github.com/uport-project/veramo/commit/353449c5a2f9a9c0919b4e38a44012fdf98ec8a9))
* Renaming to sender and receiver ([bf33a2d](https://github.com/uport-project/veramo/commit/bf33a2de268cf07b06faa04283ec066573c37ffc))
* Resolver config ([2fdba37](https://github.com/uport-project/veramo/commit/2fdba37833c5ad7f40a9bdb70e69eab91ce291ca))
* Running local cli ([8609019](https://github.com/uport-project/veramo/commit/8609019ddc94f3d5fb1d973228740a6ec4e460cc))
* SDR findCredentialsByFields iss ([6838d04](https://github.com/uport-project/veramo/commit/6838d04b4c97cf7c11c17f4b8cdfdcebb274161a))
* Selective disclosure gql resolver ([f4ec808](https://github.com/uport-project/veramo/commit/f4ec808cc73fa6096556e0535482611b46c45656))
* ServiceManager and AbstractServiceController ([284badc](https://github.com/uport-project/veramo/commit/284badc52b420c637d0c7bc6823b71f1ea5c449d))
* Sign auth token for every sync query ([2a978cb](https://github.com/uport-project/veramo/commit/2a978cbe349bc1c059c713e6ba1ca7a3c8904d77))
* TG subscribtion ([5334fc6](https://github.com/uport-project/veramo/commit/5334fc65b8008b3ddd699fa495b2665a4f168a8c))
* TG subscription ([a389612](https://github.com/uport-project/veramo/commit/a38961238af36277cf1cf8316148cb947aa37f6a))
* TG subscription connection params ([b7b79d8](https://github.com/uport-project/veramo/commit/b7b79d8de874b6010c0017b66b2e775c76c9d514))
* Unifying debug messages ([efb4f3b](https://github.com/uport-project/veramo/commit/efb4f3bf9f6d3f0d412eb80da7bb4ae92ce8ca72))
* Using local version of DIDComm lib ([d09a326](https://github.com/uport-project/veramo/commit/d09a326793c45c2a58c8a30da6263fc7f3ff7668))
* **package:** SDR query subject ID type ([5867c2d](https://github.com/uport-project/veramo/commit/5867c2d01b1a69d44e4e8f62ed82cb3e0095af5e))
* Return empty array for empty threads ([fdb1e54](https://github.com/uport-project/veramo/commit/fdb1e54fbd43657dd42180926cc160da7245db31))
* Returning newMessage sender & receiver ([72bfb60](https://github.com/uport-project/veramo/commit/72bfb60e95e2195b4f17c05b16878bfa4050b427))
* SDR can have empty to field ([108f22c](https://github.com/uport-project/veramo/commit/108f22c96dd96453fd6f811cf32aeffdcc97b2be))
* TG findEdges fromDID ([dc63238](https://github.com/uport-project/veramo/commit/dc63238b34d8d448ded854c7635a55750d02f122))
* TGE subscribtion query ([17863a2](https://github.com/uport-project/veramo/commit/17863a201edd7f561dab7b1831c8ba45a13abe02))
* Typescript types ([72c1899](https://github.com/uport-project/veramo/commit/72c18993ddba6a7a75ae8397e6549cdd29dccb31))
* Typo ([0a47c70](https://github.com/uport-project/veramo/commit/0a47c70fac8c9624c73343c8067d11fab3cd2c9d))
* Unit tests ([d764531](https://github.com/uport-project/veramo/commit/d764531fe022b1cef4abe33c9a434a53cb2fa23f))
* ValidateMessage can throw an error ([d00dcdd](https://github.com/uport-project/veramo/commit/d00dcddaf69eae26445f7b2ac1fe79b0027e297c)), closes [#10](https://github.com/uport-project/veramo/issues/10)
* VC / VP hash ([d4fa78f](https://github.com/uport-project/veramo/commit/d4fa78ff0d03d64db6806fde9fdd6c7201ce1969))
* Version bump ([00f0d2f](https://github.com/uport-project/veramo/commit/00f0d2ff3aea786e1f6c5142e41f387c09f8ef3e))
* Version bump ([d374d73](https://github.com/uport-project/veramo/commit/d374d739bbf28655ed9cb546d7d785fafad94f4c))
* Version bump ([2829540](https://github.com/uport-project/veramo/commit/2829540c247255251961415d63e87b28fb7a00a5))
* Version bump ([b474df8](https://github.com/uport-project/veramo/commit/b474df8441c242a39de00a04b18805a42c13101a))
* Version bump ([b28e17f](https://github.com/uport-project/veramo/commit/b28e17f19cf2f78c33e5157b7ef498a694c761f2))
* VP aud ([bc9f498](https://github.com/uport-project/veramo/commit/bc9f4988c66fbeadb7e6ce38aec446fd5d38339d))
* VP type is VerifiablePresentation ([d59c2b8](https://github.com/uport-project/veramo/commit/d59c2b88b0c44c5efc0f17377967930c5404f769))
* W3C VP subject is aud ([991e64b](https://github.com/uport-project/veramo/commit/991e64b3189405ddf2c3a43acc15c2ffe652380a))
* Wait for messages to be validated ([717b285](https://github.com/uport-project/veramo/commit/717b2858b2c96efdfb39f85297f4026585b366be))


### Code Refactoring

* Rename Identity to Identifier ([#308](https://github.com/uport-project/veramo/issues/308)) ([7812e51](https://github.com/uport-project/veramo/commit/7812e51ee250265bcc308e7fd4db1ee8b2e408a4))
* **daf-cli:** Refactor CLI command palette ([#304](https://github.com/uport-project/veramo/issues/304)) ([a5a0670](https://github.com/uport-project/veramo/commit/a5a0670f5162e3f8753fa338ed00e64397c8acc0)), closes [#264](https://github.com/uport-project/veramo/issues/264)
* Refactor and add inline documentation to daf-w3c package ([f0e2cb9](https://github.com/uport-project/veramo/commit/f0e2cb9748dc04b0d46ac1d80bac9a0b7f7546cd))


### Features

* ActionSendDIDComm ([49e6841](https://github.com/uport-project/veramo/commit/49e68412478b6bada8d524c719cb3ff86987015a))
* Add event system to agent ([#262](https://github.com/uport-project/veramo/issues/262)) ([9a6747e](https://github.com/uport-project/veramo/commit/9a6747e84037613d396e14a6f68cb2de8275ddca))
* Add GraphQL IdentityManager methods ([189a218](https://github.com/uport-project/veramo/commit/189a21843feb25a075f693377573f2b031c0de02))
* Add port option to cli server ([4f66a38](https://github.com/uport-project/veramo/commit/4f66a388eaafd3657882569c60e5f3d9edf6b4b3))
* add removeKey, removeService methods to ethr-did-provider ([#310](https://github.com/uport-project/veramo/issues/310)) ([faccca6](https://github.com/uport-project/veramo/commit/faccca6abd5edfda633414daba6694a78bc80ec2)), closes [#144](https://github.com/uport-project/veramo/issues/144)
* Add version cmd to cli ([64069e9](https://github.com/uport-project/veramo/commit/64069e9d60008007a801f127280430538b23b553))
* Added credentialType to the Claim ([45a4da2](https://github.com/uport-project/veramo/commit/45a4da2a76c4bb7ccb6c2d89cfce4c6e56d2cca0))
* Added id and tag fields ([0b62eaa](https://github.com/uport-project/veramo/commit/0b62eaa30ceb2f79192a476ff9f6809cbe5b1ccf))
* Added identityManagerGetIdentityByAlias ([43d0817](https://github.com/uport-project/veramo/commit/43d081761f68015b92554224e458853070f12be2))
* Added identityManagerImportIdentity ([ea7ba3a](https://github.com/uport-project/veramo/commit/ea7ba3a8e827423748e5e350cdcf4103560fb8f0))
* Added identityManagerSetAlias ([a2bd513](https://github.com/uport-project/veramo/commit/a2bd5134e9f6c58a619f63e8f3523e24e27d530e))
* Added IIdentityManagerGetIdentitiesArgs ([1e0c9aa](https://github.com/uport-project/veramo/commit/1e0c9aa5ca7247007abc930b214c98610578fb71))
* Added keyManagerGetKeyManagementSystems ([9741462](https://github.com/uport-project/veramo/commit/974146281b400fa9d3108a8428d0d9da09dd2292))
* Added save to GQL handleMessage ([be23418](https://github.com/uport-project/veramo/commit/be234186f5b2fc10881a9963bb269c48d960efa2))
* Adding createProfilePresentation ([ae5e73f](https://github.com/uport-project/veramo/commit/ae5e73fab9c21a7a2ed485be88d9f0b7cfab51c4))
* Adding ethr-did gas and ttl config ([d910b14](https://github.com/uport-project/veramo/commit/d910b140f78efc69b80adffacd00058b9477fc94))
* Adding some key manager methods ([ec6645d](https://github.com/uport-project/veramo/commit/ec6645dbfffd509b7e721dd18bad593b68edd6ab))
* Agent dbConnection constructor option ([e3dfc2f](https://github.com/uport-project/veramo/commit/e3dfc2f9a76fbe15ebb4cd2741d8ff580836408f))
* API key / Bearer token support in CLI ([45e7591](https://github.com/uport-project/veramo/commit/45e7591dc70a862e40ac3c8ab3536ad5d80632b7))
* Authorized agent methods ([53f9454](https://github.com/uport-project/veramo/commit/53f9454b6ec7495d2cfc0e2e9f34ccb0845c8a39))
* Beta of daf-elem-did ([fe286e3](https://github.com/uport-project/veramo/commit/fe286e347107cfc29a93cfaff085e524f4e2cff5))
* Bump version ([63dd12d](https://github.com/uport-project/veramo/commit/63dd12da63b2245d32379b435a7a774a56a1f019))
* Bump version ([cf659c0](https://github.com/uport-project/veramo/commit/cf659c09768325031fe66adc0228eb1d976f2932))
* Changed DID type from ID to String ([55ccdd4](https://github.com/uport-project/veramo/commit/55ccdd42f104bc93df4621a854719cb4723b3d89))
* CLI config ([5a3391e](https://github.com/uport-project/veramo/commit/5a3391e77790e0b10268c4e189f34c5f20246616))
* CLI create-config ([ec96204](https://github.com/uport-project/veramo/commit/ec96204c9d175456a8a9ce83991bceedd2a81369))
* CLI Data explorer ([fb7d155](https://github.com/uport-project/veramo/commit/fb7d1554794860e71a941cdcb8e991b18609e608))
* CLI execute object type ([e04b0ee](https://github.com/uport-project/veramo/commit/e04b0ee97a0796c9b24d1d378d4f1e8da8b1028b))
* CLI execute uses OpenApi (mvp) ([cb310dd](https://github.com/uport-project/veramo/commit/cb310dd194677f42e2d054d27859d99ecae63696))
* CLI handling ngrok errors ([eed46d4](https://github.com/uport-project/veramo/commit/eed46d4b21ae7aebd94f515e27bfb67dc3bd9efa))
* CLI server homepage template ([ac9cf52](https://github.com/uport-project/veramo/commit/ac9cf526bbbc210de15e933970b5eac3ab646c17))
* CLI upgraded to the latest API ([b440dd1](https://github.com/uport-project/veramo/commit/b440dd10badc03d71d59f23eddd80d93a680efe0))
* Constructing agent from YAML config ([7a2498f](https://github.com/uport-project/veramo/commit/7a2498fd8e3a9b4a2591cb644205f5afe62ba776))
* Credential Status in data model ([24e2d5d](https://github.com/uport-project/veramo/commit/24e2d5d1e46a33dde96e7a519b171c0453d34401))
* daf-elem-did ([62776c2](https://github.com/uport-project/veramo/commit/62776c274838b686f954e66482ae99e336bb2e16))
* Daf-express overrides ([31a0970](https://github.com/uport-project/veramo/commit/31a09708000f2c505c4d2a71201d3739da2f713e))
* Daf-react-native-libsodium ([dbec780](https://github.com/uport-project/veramo/commit/dbec78036118587e7a86dc1826d5c3c91e534069))
* Daf-rest & daf-express ([9c9a597](https://github.com/uport-project/veramo/commit/9c9a597d40059a11fe64780c459233490cb1a5ef))
* DB Migration CredentialStatus ([44fd36d](https://github.com/uport-project/veramo/commit/44fd36d0a97af96bfca74d1a9953293c00003dcc))
* Debug agent.execute ([fb58ddc](https://github.com/uport-project/veramo/commit/fb58ddce18cb99e4aeb1f7eb7604e4a65fa293f3))
* Default IdentityProvider ([39f2e39](https://github.com/uport-project/veramo/commit/39f2e39685a58d647822aea73a8bb3f7fb76fe25))
* Default IdentityProvider ([3334f6e](https://github.com/uport-project/veramo/commit/3334f6edea1ebd51dde1b416b153294f4b945e4b))
* Docker image and docker-compose example ([84ddcad](https://github.com/uport-project/veramo/commit/84ddcad8b54fec0b53297cbfe11275af06922cd6))
* Dynamic OpenAPI schema ([f12236b](https://github.com/uport-project/veramo/commit/f12236beeabd408cbc1d3a47848add82cbd52050))
* enable CORS in daf-cli server by default ([#284](https://github.com/uport-project/veramo/issues/284)) ([aca46b3](https://github.com/uport-project/veramo/commit/aca46b3fdf4e9ca4af620fbd7938aeb87c1f9e95))
* Enable setting headers to DAF DID Comm ([#239](https://github.com/uport-project/veramo/issues/239)) ([03f3dbb](https://github.com/uport-project/veramo/commit/03f3dbb9c1f8a2b061234cdddf4d70953209c1b3))
* Encrypting private keys with SecretBox ([8833931](https://github.com/uport-project/veramo/commit/883393192cc830534cfec892b4ce271a09bff99d))
* Encrypting private keys with SecretBox ([b8cbdd4](https://github.com/uport-project/veramo/commit/b8cbdd4f96e51ea15786328b2821509cc59e4ba3))
* ENV support in yml config ([1dee7b2](https://github.com/uport-project/veramo/commit/1dee7b2b45716b9d2f5e0560228166ab59ce8f60))
* Exporting findCredentialsForSdr ([ef1c973](https://github.com/uport-project/veramo/commit/ef1c9735bb718197c92c1f920a978eadf1318ef6))
* Express router ([4b8c3d6](https://github.com/uport-project/veramo/commit/4b8c3d6747a6797500468ba907a37a231fd929a4))
* Generate plugin schema ([#277](https://github.com/uport-project/veramo/issues/277)) ([c90473a](https://github.com/uport-project/veramo/commit/c90473a67731eb0cfcaf545afe0d64dfee77809c))
* Generating OpenAPI schema (broken) ([e319c41](https://github.com/uport-project/veramo/commit/e319c41d3d9a5f4beb8dfdd17221fb9ef5dc04ef))
* Generating plugin schemas ([d4450cd](https://github.com/uport-project/veramo/commit/d4450cd30e27ebc8bf961400b871757662e202c3))
* GQL count queries ([9e859c1](https://github.com/uport-project/veramo/commit/9e859c10c945a26c0a63b69acfbeee62f0bfaac3))
* Gql Not operator ([dd624c2](https://github.com/uport-project/veramo/commit/dd624c29a103b6f2e279d1b853a26a040ba7d6a9))
* GraphQL client settings: apiUrl, apiKey ([9b1fd12](https://github.com/uport-project/veramo/commit/9b1fd128a287667c7007e2acb534f5969e0d5711))
* GraphQL KeyManager ([2b092e9](https://github.com/uport-project/veramo/commit/2b092e99d1c4f8b7609257a990b76754c6e351ca))
* GraphQL message handler ([10d31cc](https://github.com/uport-project/veramo/commit/10d31cc96b293ca0c2f48fa3e39cb94612146e55))
* GraphQL methods ([6446f2d](https://github.com/uport-project/veramo/commit/6446f2d1dd1d39cc6b308d7a4b9646b1c7d6e2fa))
* GraphQL w3c ([967b916](https://github.com/uport-project/veramo/commit/967b9168536e5c5a2ba484e3f912ba4661952f8f))
* Handling credentials in SDR message ([32d4a2c](https://github.com/uport-project/veramo/commit/32d4a2c95bde9ec9f4f99679f00ef71f00aa1896))
* Identity provider for did:web ([9b20fb1](https://github.com/uport-project/veramo/commit/9b20fb13da21865d50f6e0680e0d7da040a3d75c))
* Identity provider for did:web ([ba030bf](https://github.com/uport-project/veramo/commit/ba030bf708e8e79dcf117685ace2286bff6ea69d))
* Identity saveDate updateDate ([e845a84](https://github.com/uport-project/veramo/commit/e845a841684fa092152bccc91cc1e582bae456c9))
* Multiple audience dids ([eaa1a40](https://github.com/uport-project/veramo/commit/eaa1a40d9d3728533be63660ad4cdef6bdbdeded))
* Network config for daf-resolver ([5efd82c](https://github.com/uport-project/veramo/commit/5efd82c5343dd99dc644a49774210b31bb2a717a))
* Query credentials for did ([a39f956](https://github.com/uport-project/veramo/commit/a39f9568e2b4ef3e8b0ee62f23c96451ca427cd4))
* Remote methods example ([9e61006](https://github.com/uport-project/veramo/commit/9e610067343c3363b7eadec2b0ef75644fa62bd4))
* **release:** Fix package descriptions and trigger new minor release ([#233](https://github.com/uport-project/veramo/issues/233)) ([e67f4da](https://github.com/uport-project/veramo/commit/e67f4da055d1f0b1b0ba4205726b79979d234a06))
* **release:** Trigger a new minor release ([#234](https://github.com/uport-project/veramo/issues/234)) ([7c905e1](https://github.com/uport-project/veramo/commit/7c905e1ea7c4851f7f06e87e06efe34d4eac7b0f))
*  REST api handling incoming msg ([372cd25](https://github.com/uport-project/veramo/commit/372cd25de7030228bd12ea62eeaff824c7f6526c))
* Activity feed ([50bc5d5](https://github.com/uport-project/veramo/commit/50bc5d51788e39e18ad64b0470d62852835cfbf2))
* Add JWT output for credential.ts and sdr.ts in cli ([c16dea6](https://github.com/uport-project/veramo/commit/c16dea6da130375ecc4e98f116fae54df45d1b9a))
* Add whitelisted issuers in SDR ([f486f07](https://github.com/uport-project/veramo/commit/f486f071e3e3ccd55e70d01255275d7b2e770169))
* Added actionSignVc mutation ([4ef9a15](https://github.com/uport-project/veramo/commit/4ef9a15374364b91026f4a0f37ed85dd60c3cb50))
* Added actionSignVp mutation ([7cedec1](https://github.com/uport-project/veramo/commit/7cedec1d384eeba53012a2cd319c6c0bad0282f6))
* Added daf-did-jwt ([22898d4](https://github.com/uport-project/veramo/commit/22898d491af031e72059e226e5aa39ccb25b59a6))
* Added data-explorer to daf-cli ([eebe040](https://github.com/uport-project/veramo/commit/eebe040ca4e8017e2e59072047c0f479811b2004))
* Added react-native-async-storage ([1270740](https://github.com/uport-project/veramo/commit/127074033bef2cebc1e31d477f5b9f71ffa024d5))
* Adding daf-ethr-did-local-storage ([f73b435](https://github.com/uport-project/veramo/commit/f73b4358be5407634c37f89dc21ad9f145629284))
* Adding daf-random ([f362f6b](https://github.com/uport-project/veramo/commit/f362f6bc6f5c8c9c820c0b1551515543ec17cb51))
* Adding daf-react-native-libsodium ([6446411](https://github.com/uport-project/veramo/commit/6446411d2acdd52b75242e56ab5428f80f8ba261))
* Adding list of messages ([72dca61](https://github.com/uport-project/veramo/commit/72dca619b99ea2afcc216df07ef789043998702e))
* All ethr Identity Providers updated ([552c967](https://github.com/uport-project/veramo/commit/552c967d0efac27149ea8e1a329163bdf24f8a11))
* Breaking. New did management interfaces ([c384159](https://github.com/uport-project/veramo/commit/c3841591189dc307ba281a72186dbb878d9aa5be))
* Bump minor version (npm conflicts) ([67b77af](https://github.com/uport-project/veramo/commit/67b77af9c33684a19ed3e34a740c776f0f419d06))
* Bump minor version (npm conflicts) ([34cefc2](https://github.com/uport-project/veramo/commit/34cefc2370c6b207d4b7d490571c0df0653b1d8f))
* cli identity management improvements ([489b5e9](https://github.com/uport-project/veramo/commit/489b5e927151f6913ad9fcbaf67c0359d88a6341))
* Create + Send SDR request ([d87127b](https://github.com/uport-project/veramo/commit/d87127b97283a9fdcc8f9ac5b244f23b0a187cd8))
* Create and send VP from CLI ([c7e1360](https://github.com/uport-project/veramo/commit/c7e1360ad5fb8c788635ad33d084c67feec0f7e6))
* daf-cli credential sending, receiving ([7ca187e](https://github.com/uport-project/veramo/commit/7ca187e63b264a59ddfe0805410d56e317d2dbae))
* daf-cli identity-manager ([8f89979](https://github.com/uport-project/veramo/commit/8f8997953c8e7e64bd0e76240b51460d40d00f28))
* daf-debug ([ff8d66b](https://github.com/uport-project/veramo/commit/ff8d66b735d2f29d48077ad9ff07305a778ef38e))
* daf-did-comm ([2ee986f](https://github.com/uport-project/veramo/commit/2ee986fcb5b8cb235ac18e421e6e430980948481))
* daf-ethr-did-fs ([c2e8024](https://github.com/uport-project/veramo/commit/c2e80246b694cb9f55b9c9116c2aac8d0257927d))
* Daf-ethr-did-fs using experimental interface ([cecffd8](https://github.com/uport-project/veramo/commit/cecffd8de4fe161abe0013ab7b715860a591c365))
* daf-ethr-did-react-native ([20a47d5](https://github.com/uport-project/veramo/commit/20a47d581aed0c2aed7d5c19ae79603010a0a859))
* daf-react-native-sqlite3 ([cdcb5ac](https://github.com/uport-project/veramo/commit/cdcb5ac9a8e151abbc6adfdbd1b048908b58f573))
* daf-resolver, daf-resolver-universal ([2b2c00f](https://github.com/uport-project/veramo/commit/2b2c00f9312ae67cdeca4a5f15b729391226500e))
* daf-selective-disclosure ([7bbcf12](https://github.com/uport-project/veramo/commit/7bbcf12952fa7a1fa726b944f09e84e416560a40))
* daf-sodium-fs ([42b5d19](https://github.com/uport-project/veramo/commit/42b5d1975e8970e3ecb26cdc54731a1cd618fa35))
* daf-trust-graph ([2ba3c4f](https://github.com/uport-project/veramo/commit/2ba3c4fb4346c0522a56855dbeb3631ddea356b5))
* daf-w3c ([b0da9ae](https://github.com/uport-project/veramo/commit/b0da9aea42be9fb84e6d65d157c6815ef4a91758))
* Data deduplication ([c5c10b1](https://github.com/uport-project/veramo/commit/c5c10b17eebd1d6f82a43f0d5cc46da9b9270c3e))
* Data-store upgrade ([c4c0810](https://github.com/uport-project/veramo/commit/c4c081023fb331bf7cb8c19ca2e5c79e8db6b506))
* Delet identity and conditions ([37ca91e](https://github.com/uport-project/veramo/commit/37ca91e223f25ef1ca14cea8cc61531643571650))
* Entities ([7f1c85f](https://github.com/uport-project/veramo/commit/7f1c85f84c64d49435ee1c8049b00559f3863442))
* Ethr-did export/import ([0f8ab11](https://github.com/uport-project/veramo/commit/0f8ab111a5e96d3a687b318605ab2ff607c7bf23)), closes [#105](https://github.com/uport-project/veramo/issues/105)
* Example expressjs ([3b79989](https://github.com/uport-project/veramo/commit/3b79989a25e9740cc477c8428182a78346e80d7c))
* Example id-hub ([9187906](https://github.com/uport-project/veramo/commit/9187906f0e63bbf68bb92eeb54950288fcf3c62e))
* Experimentation ([134a812](https://github.com/uport-project/veramo/commit/134a81227e6abb132d8d216dec7dee36d34b9710))
* Experiments with KeyStore IdentityStore ([cca8825](https://github.com/uport-project/veramo/commit/cca88254f14414771c9f1d3523cfb72a4954c080))
* Fetching URL to get the message payload ([72596e4](https://github.com/uport-project/veramo/commit/72596e4fd71d66a395c109c88ae2419187459269))
* FS dids backed by jwk ([7a93f7c](https://github.com/uport-project/veramo/commit/7a93f7c86b29805a4718f78038c372ef563a850a))
* FS IdentityStore ([a2521e0](https://github.com/uport-project/veramo/commit/a2521e0e36a9531478910815d17409bc749658c2))
* FS KMS ([1bcf4c1](https://github.com/uport-project/veramo/commit/1bcf4c1ecc29c674c9525946eb5b9bacecd2c550))
* Global state for identity ([06ff655](https://github.com/uport-project/veramo/commit/06ff6555fc0ca2f99ea2f3fbf1a1c688242ad819))
* GQL queries WIP ([b581061](https://github.com/uport-project/veramo/commit/b58106161056e54522e66711f54a879a04e547ff))
* GQL queries WIP ([698aca4](https://github.com/uport-project/veramo/commit/698aca4d006a395a63577b49f7e739b4bdd645b4))
* GQL query to get latest service messages ([8061fbe](https://github.com/uport-project/veramo/commit/8061fbed8fc3626b165b8c03dee79901682f60a2))
* GraphQL queries for entities ([9faa883](https://github.com/uport-project/veramo/commit/9faa883c616892f85e924dd8747a0ad42aeb5bf0))
* GraphQL queries for entities ([0581795](https://github.com/uport-project/veramo/commit/058179501da5475e3826b8d64f160556c0595832))
* Graphql server in CLI ([70890bd](https://github.com/uport-project/veramo/commit/70890bd6ecf687fee8534312a2888a91552e3a5e))
* IdentityController, KeyStore ([e86fec4](https://github.com/uport-project/veramo/commit/e86fec425aba3c80dc49520f205e9317deea43bc))
* IdentityStore and KeyStore in daf-core ([238539c](https://github.com/uport-project/veramo/commit/238539c59c328baf4a4f84c0fe86520bfefdd680))
* IdentityStore docs ([190b505](https://github.com/uport-project/veramo/commit/190b5052a800c9893c27fe57b89c50cce9fc9343))
* Initial dashboard layout ([31b69a8](https://github.com/uport-project/veramo/commit/31b69a8914cdfcc763df7441187bf4384d89f21c))
* Issue credential rewired ([1351a56](https://github.com/uport-project/veramo/commit/1351a568dadb0010288a6b28f62badb5e114f410))
* LatestClaimValue method ([8df54b8](https://github.com/uport-project/veramo/commit/8df54b8ae0f9b7b308c64e3652d0ccd10130b3cc))
* List known identities in connections view ([784c29b](https://github.com/uport-project/veramo/commit/784c29b9177c23f51e36b856d23107f011384096))
* Loading indicator ([a463e40](https://github.com/uport-project/veramo/commit/a463e40cc597c8bcbe5e4dbf95cfc19abbb66667))
* Message object with validation ([8bf6a9d](https://github.com/uport-project/veramo/commit/8bf6a9d47e73d6e2be9003854718b67f59c636dd))
* Metamask Identity Controller ([720b52c](https://github.com/uport-project/veramo/commit/720b52c7af89e2e54734b296b7bb0c7cf3905e14))
* Method dataStoreORMGetIdentities ([7952fbb](https://github.com/uport-project/veramo/commit/7952fbbdc6b2030b7fc004f949908860920f93d4))
* Method identityManagerGetOrCreateIdentity ([0155389](https://github.com/uport-project/veramo/commit/0155389bf8ad3cfe6f4802d1ac5ce655321423c6))
* More queries ([30ac032](https://github.com/uport-project/veramo/commit/30ac032ef0047e812b220caf9046e3269d7c2e39))
* More queries ([29bf414](https://github.com/uport-project/veramo/commit/29bf414d907bc4ae8947e777034e35f9f15c3fa5))
* Moving DID Doc management to the provider ([b6bd930](https://github.com/uport-project/veramo/commit/b6bd9300464923fac6c464d0997216f2cc5faec8))
* New DID management interfaces ([9599e2a](https://github.com/uport-project/veramo/commit/9599e2a5e75f0d6d0adaa5229e9653c8c3d9fa80))
* New Identity TS and GraphQL interfaces ([3f8ff1c](https://github.com/uport-project/veramo/commit/3f8ff1c0c8edd9f1f8a25343a265b78eeecb32e3))
* New Identity TS and GraphQL interfaces ([a36d691](https://github.com/uport-project/veramo/commit/a36d69103cf582d4929a37f8329b03e550a2ea32))
* Ngrok support in CLI ([56c464d](https://github.com/uport-project/veramo/commit/56c464db7f6681931fa16928351e349344c36cec))
* OpenAPI server in CLI ([ccdd6a7](https://github.com/uport-project/veramo/commit/ccdd6a790bc219fbaf5b848d91b1181b0050154c))
* Optional polling interval ([f03aad6](https://github.com/uport-project/veramo/commit/f03aad6dabece3a89727e3fe97aaf761e63d7e94))
* Optionally add permissions to gql resolvers ([0d5b212](https://github.com/uport-project/veramo/commit/0d5b2126618d81e5f0d1ba5ae30fc33901b8dc94))
* pass along authentication metadata into handlers ([199426b](https://github.com/uport-project/veramo/commit/199426b4dba9013d34fea92585583487abdae041))
* Passing keyStore to Identity object ([dafcac2](https://github.com/uport-project/veramo/commit/dafcac2873740cd405b65f377b97813db2be7637))
* Provide link to DID document ([1578c1c](https://github.com/uport-project/veramo/commit/1578c1c4f7cafffe2ca5b40643a3213dd0ac5c4d))
* PublicProfile VP in CLI server ([6d6b710](https://github.com/uport-project/veramo/commit/6d6b7107ed31c78bc7beb309b4a7bce44aeed84f))
* Publishing serviceEndpoint to DID Doc ([a9fb385](https://github.com/uport-project/veramo/commit/a9fb385f098fec49bb659ef4e1bacdfde221c6a4))
* Query for single credential by id(hash) ([1283ce5](https://github.com/uport-project/veramo/commit/1283ce528695d179b4b1cad7075c3b34e647fdb0))
* Registry config ([fe2ebc6](https://github.com/uport-project/veramo/commit/fe2ebc6cf5d8146fe0e22bfafcceca44dd5cea44))
* Reinstate `credentialStatus` as top level attribute ([4b17689](https://github.com/uport-project/veramo/commit/4b1768936a173844e8710993a42600eab4051f9c))
* Reinstate `credentialStatus` as top level attribute ([8347b1f](https://github.com/uport-project/veramo/commit/8347b1f5e93840ae6f6548609b87720027dc538e))
* Removing daf-debug ([a1ebe1d](https://github.com/uport-project/veramo/commit/a1ebe1d63fc6dce1c4270cf300acb452fa034c28))
* Removing examples from workspaces ([5cf7343](https://github.com/uport-project/veramo/commit/5cf7343d99cdad5b6719ae38371f5e8710813979))
* Removing GraphQL support ([3646aab](https://github.com/uport-project/veramo/commit/3646aaba6bc72db933ceb7ddb4250bf4457902e3))
* Removing profile service CLI ([dc93089](https://github.com/uport-project/veramo/commit/dc93089eed40e69bf99946a60aed8f19d34e091b))
* Renamed Core to Agent ([f2c79b6](https://github.com/uport-project/veramo/commit/f2c79b69c59929deaa67a55d5b5b0caf8523ff5b))
* Renaming MessageValidator to MessageHandler ([586b43c](https://github.com/uport-project/veramo/commit/586b43c628028d5c6d6550a9e87877385fa8c4fc))
* Respond to SDR request ([8aafc6b](https://github.com/uport-project/veramo/commit/8aafc6b288ec9cdabf9e64fd70d987d080278f13))
* REST API example ([0102582](https://github.com/uport-project/veramo/commit/0102582e48acfa5e3ff2c6230098b26d16d312c3))
* Return the txHash in addPublic key ([c56ada2](https://github.com/uport-project/veramo/commit/c56ada29264a3cb77ae8fb4b8f887e00be257838))
* Sample auth ([ef30a6e](https://github.com/uport-project/veramo/commit/ef30a6e766ddb7048e5a94f99070fb875e8f4da1))
* Saving message and VC meta data ([1928125](https://github.com/uport-project/veramo/commit/1928125e3c3ff17e86e838a9c84ddfadb2631a48))
* SDR helper and specs ([c00b5c1](https://github.com/uport-project/veramo/commit/c00b5c186bfb6f87bb2a01d881d2f8ff1200e6f8))
* SDR validation ([12ff8eb](https://github.com/uport-project/veramo/commit/12ff8ebc0bc297fb0e272432e91a107b6edfc6af))
* Selective Disclosure Request ([9afe0c5](https://github.com/uport-project/veramo/commit/9afe0c5a2fae7e3f778fe99ff4f88f44f61d3b94))
* Sending encrypted DIDComm messages ([2f12513](https://github.com/uport-project/veramo/commit/2f125130c46817a3326037984f0d5227cb1c1a54))
* Server / Client example ([f757b7e](https://github.com/uport-project/veramo/commit/f757b7eaeeecdaa26aaa65c3dcdbdf9b37f1d5fd))
* Server config ([b3b9639](https://github.com/uport-project/veramo/commit/b3b9639e7f1382110b34bdb26073ed0bd97eb982))
* Set default did as first ([cc9332c](https://github.com/uport-project/veramo/commit/cc9332cc8be09622b37c8f4a775df0965d310cef))
* Setup routing and layout templates ([19236cd](https://github.com/uport-project/veramo/commit/19236cd3cbccf1c58ad340a59ca0e6072092e69e))
* Show credentials on connections ([84abfa0](https://github.com/uport-project/veramo/commit/84abfa0f2ea2c0e009692cf0ccd76a93c968f0ea))
* Show gravatar for did ([f537372](https://github.com/uport-project/veramo/commit/f537372db8d3c24a4024922f04a8fa8b24560ede))
* Show Request in sidepanel ([d930b92](https://github.com/uport-project/veramo/commit/d930b92aabc94f1b8e6ecfccc30c28c8b144be90))
* SignCredentialJwt returns Credential ([8aefe92](https://github.com/uport-project/veramo/commit/8aefe9216f71cc95812b3f60bd40b1187995ff06))
* Simple login flow ([8d6042a](https://github.com/uport-project/veramo/commit/8d6042aea5f9d35c119c0033d701682f21dfd09a))
* Simpler create VC/VP ([#309](https://github.com/uport-project/veramo/issues/309)) ([172c908](https://github.com/uport-project/veramo/commit/172c9088fae4b758b79436d9ae11c8c1f1785341))
* TypeORM wip ([27e4ab2](https://github.com/uport-project/veramo/commit/27e4ab2676042cea96370ba31d5dd7fc1c8cceb5))
* Unique (with hash) VC/VP in ORM results ([bcfc3e8](https://github.com/uport-project/veramo/commit/bcfc3e843885553abea1e90bc2a833abc6e8e3ec))
* Universal resolver unit tests ([8b92d1c](https://github.com/uport-project/veramo/commit/8b92d1c032b19124271bff7884ceebace6331a4e))
* Update readme ([39a3261](https://github.com/uport-project/veramo/commit/39a3261525d319831cf00ae73eb798a9691ceb5a))
* Updated architecture diagram ([dafa3c0](https://github.com/uport-project/veramo/commit/dafa3c086bf367470e8620ef8b19a8cbf705b5e2))
* Updated entities ([00db341](https://github.com/uport-project/veramo/commit/00db341ca10ae08d1afa666b880ffd066b5b6bbc))
* Updated lock file ([c46ecf2](https://github.com/uport-project/veramo/commit/c46ecf2397625bcc4f0f0831d598140e765511ff))
* Updating docs ([86ba15c](https://github.com/uport-project/veramo/commit/86ba15c70474436bf9a4ac5c043248fed4b3b274))
* Updating examples to the new API ([13c7e3b](https://github.com/uport-project/veramo/commit/13c7e3b625ed1924f2ff9346ff0ab40337fcc8d4))
* URL message validator ([7e516e4](https://github.com/uport-project/veramo/commit/7e516e4065251ba7eaa2ab9c32fbfbda7e318bb1))
* Use handleMessage instead of validateMessage ([75fb74a](https://github.com/uport-project/veramo/commit/75fb74ad1cab8fc6c8ec6c507850d27ef507e9af))
* Using agent created from YAML config ([ce2960c](https://github.com/uport-project/veramo/commit/ce2960cfe6114f2e6272d5200419930f7042cf12))
* Using data store ([c2b76fd](https://github.com/uport-project/veramo/commit/c2b76fd3c3db61ba1916e280fd05381c977d6be6))
* Using DIDComm for encryption ([02fefa9](https://github.com/uport-project/veramo/commit/02fefa9930961618d723ed74d244de932e93ce76))
* Using EventEmitter instead of pubsub-js ([5d50acf](https://github.com/uport-project/veramo/commit/5d50acf0c9fbdb9ea45f0e90a55b64a1a1e5dfde))
* Using OpenAPI schema in rest & express ([80d0bad](https://github.com/uport-project/veramo/commit/80d0badb6c4ed17ccf2250d4381b71f08ef3da45))
* Validating all plugin method arguments ([2c868f7](https://github.com/uport-project/veramo/commit/2c868f77f297d036554ab8b30b77124c57b824da))
* Validating returnType ([c7d1ef3](https://github.com/uport-project/veramo/commit/c7d1ef3bd77dd4a77cf9dcfa32a2ed8b47fe04e0))
* Validation in SDR response ([fab06d2](https://github.com/uport-project/veramo/commit/fab06d209e0430869b725f58ff9b68cdaf6d826f))
* Version bump ([5f8c0fe](https://github.com/uport-project/veramo/commit/5f8c0fe551f9512401ff4f68baa171a8aaeec419))
* Version bump ([f482187](https://github.com/uport-project/veramo/commit/f482187a776f05f1977d3c01caa8acc2e0e6c08f))
* Version bump ([c981add](https://github.com/uport-project/veramo/commit/c981addb07b7c200a65324370c4e1a60461f7947))
* Version bump ([4fd60a9](https://github.com/uport-project/veramo/commit/4fd60a9a73130ee5e11ac9bf87b0c7864458c70b))
* Web DID path (multi user) support  ([#282](https://github.com/uport-project/veramo/issues/282)) ([08996bd](https://github.com/uport-project/veramo/commit/08996bdc72481df8a7b701b8cd0a4f2eceaa21a0))
* WIP ([f491371](https://github.com/uport-project/veramo/commit/f4913711ce4f9dc546bbf5ae29689b1d0ee95e14))


### BREAKING CHANGES

* This rename affects almost all the Identity management API
Please look for `IDIDManager.ts` in `daf-core/src/types` to see the new method names.
Functionality is the same but some renaming is required if already in use.

* refactor: Rename Identity to Identifier
* fix: Integration tests
* refactor: WebDIDProvider
* refactor: EthrDIDProvider
* refactor: DIDStore
* refactor: Resolver
* refactor: DidManagerFind
* refactor: DidManagerFind
* refactor: DidManagerGet
* refactor: DidManagerCreate
* refactor: DidManagerGetOrCreate
* refactor: DidManagerImport
* refactor: DidManagerDelete
* refactor: KeyManager
* refactor: DefaultDID
* refactor: IDIDManager
* refactor: IDIDManager.ts
* **daf-cli:** This refactor changes the CLI list of commands. Run `daf --help` to get the latest options.
The same actions are possible, but under different (simpler) names and subcommands.
* **daf-resolver:** The configuration for daf-resolver has changed to be less opinionated. It requires a `did-resolver#Resolver` that can be configured with whichever DID methods your agent needs.

Co-authored-by: Mircea Nistor <mirceanis@gmail.com>
* the `IW3c` type and `W3c` class have been renamed to
`ICredentialIssuer` and `CredentialIssuer`

fix(deps): update `did-resolver` and `did-jwt` libs for all packages to maintain type consistency
* database schema change required to accept large claims
* DB Schema change
* Introducing TypeORM - support for more databases
Deprecating some packages.
* Introducing TypeORM - support for more databases
Deprecating some packages.
* new interfaces for IdentityManager
 AbstractIdentityController AbstractIdentityProvider
 AbstractIdentityStore AbstractIdentity
AbstractKeyManagementSystem AbstractKey AbstractKeyStore
