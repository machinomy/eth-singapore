import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class BotRecord {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  tweetId: string

  @Column()
  sourceAccount: string

  @Column()
  sourceAccountID: string

  @Column()
  destinationAccount: string

  @Column()
  destinationAccountID: string
  // @Column()
  // sourceAddress: string
  //
  // @Column()
  // destinationAddress: string

  @Column()
  amount: string

  @Column()
  status: string

  constructor (tweetId: string, sourceAccount: string, destinationAccount: string, sourceAccountID: string, destinationAccountID: string, amount: string, status: string) {
    this.tweetId = tweetId
    this.sourceAccount = sourceAccount
    this.destinationAccount = destinationAccount
    this.sourceAccountID = sourceAccountID
    this.destinationAccountID = destinationAccountID
    // this.sourceAddress = sourceAddress
    // this.destinationAddress = destinationAddress
    this.amount = amount
    this.status = status
  }

  toJSON () {
    return {
      id: this.id,
      tweetId: this.tweetId,
      sourceAccount: this.sourceAccount,
      destinationAccount: this.destinationAccount,
      sourceAccountID: this.sourceAccountID,
      destinationAccountID: this.destinationAccountID,
      // sourceAddress: this.sourceAddress,
      // destinationAddress: this.destinationAddress,
      amount: this.amount,
      status: this.status
    }
  }
}
