// import * as cdk from 'aws-cdk-lib';
import * as cdk from "@aws-cdk/core";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as elbv2 from "@aws-cdk/aws-elasticloadbalancingv2";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecr from "@aws-cdk/aws-ecr";
import * as iam from "@aws-cdk/aws-iam";
import * as logs from "@aws-cdk/aws-logs";
import * as apig from "@aws-cdk/aws-apigatewayv2";
import * as servicediscovery from "@aws-cdk/aws-servicediscovery";
import { Construct } from "constructs";

export class SampleAppStack extends cdk.Stack  {
  
  //Export Vpclink and ALB Listener
  public readonly httpVpcLink: cdk.CfnResource;
  public readonly httpApiListener: elbv2.ApplicationListener;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
      vpcName: 'landingzone-vpc'
    });

    // const vpc = new ec2.Vpc(this, "ProducerVPC");

    // ECS Cluster
    // const cluster = new ecs.Cluster.(this, "Fargate Cluster", {
    //   vpc: vpc,
    // });
    const ServiceSecGrp = ec2.SecurityGroup.fromSecurityGroupId(this, 'SG', 'sg-0dce97b6a761c846e',
    {
      mutable: false
    });

    ServiceSecGrp.connections.allowFromAnyIpv4(ec2.Port.tcp(80));
    const cluster = ecs.Cluster.fromClusterAttributes(this, 'cluster', {
      clusterName: 'pp-backend',
      clusterArn:'arn:aws:ecs:us-east-2:855770807483:cluster/pp-backend',
      vpc,
      ServiceSecGrp,
    });


    // // Cloud Map Namespace
    // const dnsNamespace = new servicediscovery.PrivateDnsNamespace(
    //   this,
    //   "DnsNamespace",
    //   {
    //     name: "http-api.local",
    //     vpc: vpc,
    //     description: "Private DnsNamespace for Microservices",
    //   }
    // );

    // // Task Role
    // const taskrole = new iam.Role(this, "ecsTaskExecutionRole", {
    //   assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
    // });

    // taskrole.addManagedPolicy(
    //   iam.ManagedPolicy.fromAwsManagedPolicyName(
    //     "service-role/AmazonECSTaskExecutionRolePolicy"
    //   )
    // );

    // // Task Definitions
    // const bookServiceTaskDefinition = new ecs.FargateTaskDefinition(
    //   this,
    //   "bookServiceTaskDef",
    //   {
    //     memoryLimitMiB: 512,
    //     cpu: 256,
    //     taskRole: taskrole,
    //   }
    // );

    // const authorServiceTaskDefinition = new ecs.FargateTaskDefinition(
    //   this,
    //   "authorServiceTaskDef",
    //   {
    //     memoryLimitMiB: 512,
    //     cpu: 256,
    //     taskRole: taskrole,
    //   }
    // );

    // Log Groups
    // const bookServiceLogGroup = new logs.LogGroup(this, "bookServiceLogGroup", {
    //   logGroupName: "/ecs/BookService",
    //   removalPolicy: cdk.RemovalPolicy.DESTROY,
    // });

    // const authorServiceLogGroup = new logs.LogGroup(
    //   this,
    //   "authorServiceLogGroup",
    //   {
    //     logGroupName: "/ecs/AuthorService",
    //     removalPolicy: cdk.RemovalPolicy.DESTROY,
    //   }
    // );

    // const bookServiceLogDriver = new ecs.AwsLogDriver({
    //   logGroup: bookServiceLogGroup,
    //   streamPrefix: "BookService",
    // });

    // const authorServiceLogDriver = new ecs.AwsLogDriver({
    //   logGroup: authorServiceLogGroup,
    //   streamPrefix: "AuthorService",
    // });

    // Amazon ECR Repositories
    // const bookservicerepo = ecr.Repository.fromRepositoryName(
    //   this,
    //   "bookservice",
    //   "book-service"
    // );

    // const authorservicerepo = ecr.Repository.fromRepositoryName(
    //   this,
    //   "authorservice",
    //   "author-service"
    // );

    // // Task Containers
    // const bookServiceContainer = bookServiceTaskDefinition.addContainer(
    //   "bookServiceContainer",
    //   {
    //     image: ecs.ContainerImage.fromEcrRepository(bookservicerepo),
    //     logging: bookServiceLogDriver,
    //   }
    // );

    // const authorServiceContainer = authorServiceTaskDefinition.addContainer(
    //   "authorServiceContainer",
    //   {
    //     image: ecs.ContainerImage.fromEcrRepository(authorservicerepo),
    //     logging: authorServiceLogDriver,
    //   }
    // );

    // bookServiceContainer.addPortMappings({
    //   containerPort: 80,
    // });

    // authorServiceContainer.addPortMappings({
    //   containerPort: 80,
    // });

    //Security Groups


    // Fargate Services
    const Service = new ecs.FargateService.(this, "bookService", {
      cluster: cluster,
      taskDefinition: bookServiceTaskDefinition,
      assignPublicIp: false,
      desiredCount: 2,
      securityGroup: bookServiceSecGrp,
      // cloudMapOptions: {
      //   name: "bookService",
      //   cloudMapNamespace: dnsNamespace,
      // },
    });

    // ALB
    // const httpApiInternalALB = new elbv2.ApplicationLoadBalancer(
    //   this,
    //   "httpapiInternalALB",
    //   {
    //     vpc: vpc,
    //     internetFacing: false,
    //   }
    // );

    // ALB Listener
    // this.httpApiListener = httpApiInternalALB.addListener("httpapiListener", {
    //   port: 80,
    //   // Default Target Group
    //   defaultAction: elbv2.ListenerAction.fixedResponse(200),
    // });

    // Target Groups
    // const bookServiceTargetGroup = this.httpApiListener.addTargets(
    //   "bookServiceTargetGroup",
    //   {
    //     port: 80,
    //     priority: 1,
    //     healthCheck: {
    //       path: "/api/books/health",
    //       interval: cdk.Duration.seconds(30),
    //       timeout: cdk.Duration.seconds(3),
    //     },
    //     targets: [bookService],
    //     pathPattern: "/api/books*",
    //   }
    // );

    // const authorServiceTargetGroup = this.httpApiListener.addTargets(
    //   "authorServiceTargetGroup",
    //   {
    //     port: 80,
    //     priority: 2,
    //     healthCheck: {
    //       path: "/api/authors/health",
    //       interval: cdk.Duration.seconds(30),
    //       timeout: cdk.Duration.seconds(3),
    //     },
    //     targets: [authorService],
    //     pathPattern: "/api/authors*",
    //   }
    // );

    //VPC Link
    // this.httpVpcLink = new cdk.CfnResource(this, "HttpVpcLink", {
    //   type: "AWS::ApiGatewayV2::VpcLink",
    //   properties: {
    //     Name: "http-api-vpclink",
    //     SubnetIds: vpc.privateSubnets.map((m) => m.subnetId),
    //   },
    // });
  }
}
